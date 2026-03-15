package repository

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/Boyeep/flippy-backend/internal/domain"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrUserNotFound               = errors.New("user not found")
	ErrUserConflict               = errors.New("user already exists")
	ErrPasswordResetTokenNotFound = errors.New("password reset token not found")
)

type UserRepository struct {
	db *pgxpool.Pool
}

type PasswordResetToken struct {
	ID        string
	UserID    string
	TokenHash string
	ExpiresAt time.Time
	UsedAt    *time.Time
	CreatedAt time.Time
}

func NewUserRepository(db *pgxpool.Pool) UserRepository {
	return UserRepository{db: db}
}

func (r UserRepository) Create(ctx context.Context, input domain.RegisterInput, passwordHash string) (domain.User, error) {
	query := `
		INSERT INTO users (username, email, password_hash, full_name)
		VALUES ($1, $2, $3, $4)
		RETURNING id, username, email, full_name, role, status, last_login_at, created_at, updated_at, password_hash
	`

	row := r.db.QueryRow(ctx, query, input.Username, strings.ToLower(input.Email), passwordHash, nullableString(input.FullName))

	user, err := scanUser(row)
	if err != nil {
		if isUniqueViolation(err) {
			return domain.User{}, ErrUserConflict
		}
		return domain.User{}, err
	}

	return user, nil
}

func (r UserRepository) FindByEmail(ctx context.Context, email string) (domain.User, error) {
	query := `
		SELECT id, username, email, full_name, role, status, last_login_at, created_at, updated_at, password_hash
		FROM users
		WHERE email = $1
	`

	user, err := scanUser(r.db.QueryRow(ctx, query, strings.ToLower(email)))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.User{}, ErrUserNotFound
		}
		return domain.User{}, err
	}

	return user, nil
}

func (r UserRepository) FindByID(ctx context.Context, id string) (domain.User, error) {
	query := `
		SELECT id, username, email, full_name, role, status, last_login_at, created_at, updated_at, password_hash
		FROM users
		WHERE id = $1
	`

	user, err := scanUser(r.db.QueryRow(ctx, query, id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.User{}, ErrUserNotFound
		}
		return domain.User{}, err
	}

	return user, nil
}

func (r UserRepository) UpdateLastLogin(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET last_login_at = $2, updated_at = $2 WHERE id = $1`, id, time.Now().UTC())
	return err
}

func (r UserRepository) CreatePasswordResetToken(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)
	`, userID, tokenHash, expiresAt.UTC())
	return err
}

func (r UserRepository) FindActivePasswordResetTokenByHash(ctx context.Context, tokenHash string) (PasswordResetToken, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, token_hash, expires_at, used_at, created_at
		FROM password_reset_tokens
		WHERE token_hash = $1
		  AND used_at IS NULL
		  AND expires_at > NOW()
		ORDER BY created_at DESC
		LIMIT 1
	`, tokenHash)

	var item PasswordResetToken
	err := row.Scan(
		&item.ID,
		&item.UserID,
		&item.TokenHash,
		&item.ExpiresAt,
		&item.UsedAt,
		&item.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return PasswordResetToken{}, ErrPasswordResetTokenNotFound
		}
		return PasswordResetToken{}, err
	}

	return item, nil
}

func (r UserRepository) MarkPasswordResetTokenUsed(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE password_reset_tokens
		SET used_at = $2
		WHERE id = $1
	`, id, time.Now().UTC())
	return err
}

func (r UserRepository) UpdatePasswordHash(ctx context.Context, userID, passwordHash string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE users
		SET password_hash = $2, updated_at = $3
		WHERE id = $1
	`, userID, passwordHash, time.Now().UTC())
	return err
}

type userScanner interface {
	Scan(dest ...any) error
}

func scanUser(scanner userScanner) (domain.User, error) {
	var user domain.User
	var fullName *string

	err := scanner.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&fullName,
		&user.Role,
		&user.Status,
		&user.LastLoginAt,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.PasswordHash,
	)
	if err != nil {
		return domain.User{}, err
	}

	if fullName != nil {
		user.FullName = *fullName
	}

	return user, nil
}

func nullableString(value string) any {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	return value
}
