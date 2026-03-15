package domain

import "time"

type HealthStatus struct {
	Name      string    `json:"name"`
	Env       string    `json:"env"`
	Version   string    `json:"version"`
	Database  string    `json:"database"`
	Timestamp time.Time `json:"timestamp"`
}

type Course struct {
	ID          string    `json:"id"`
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Summary     string    `json:"summary"`
	Published   bool      `json:"published"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type FlashcardSet struct {
	ID               string    `json:"id"`
	OwnerID          string    `json:"owner_id"`
	CourseID         string    `json:"course_id,omitempty"`
	Slug             string    `json:"slug"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	Visibility       string    `json:"visibility"`
	Status           string    `json:"status"`
	LanguageCode     string    `json:"language_code"`
	CardCount        int       `json:"card_count"`
	EstimatedMinutes int       `json:"estimated_minutes"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Flashcard struct {
	ID             string    `json:"id"`
	FlashcardSetID string    `json:"flashcard_set_id"`
	Position       int       `json:"position"`
	Question       string    `json:"question"`
	Answer         string    `json:"answer"`
	Explanation    string    `json:"explanation,omitempty"`
	Hint           string    `json:"hint,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type User struct {
	ID           string     `json:"id"`
	Username     string     `json:"username"`
	Email        string     `json:"email"`
	FullName     string     `json:"full_name,omitempty"`
	Role         string     `json:"role"`
	Status       string     `json:"status"`
	LastLoginAt  *time.Time `json:"last_login_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	PasswordHash string     `json:"-"`
}

type RegisterInput struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"full_name"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ForgotPasswordInput struct {
	Email string `json:"email"`
}

type ResetPasswordInput struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

type AuthResponse struct {
	AccessToken string    `json:"access_token"`
	TokenType   string    `json:"token_type"`
	ExpiresAt   time.Time `json:"expires_at"`
	User        User      `json:"user"`
}

type AnalyticsOverview struct {
	Visitors      int64  `json:"visitors"`
	Pageviews     int64  `json:"pageviews"`
	ViewsPerVisit string `json:"views_per_visit"`
	BounceRate    string `json:"bounce_rate"`
	VisitDuration string `json:"visit_duration"`
	DateRange     string `json:"date_range"`
	Source        string `json:"source"`
}

type CreateFlashcardSetInput struct {
	CourseID         string `json:"course_id"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	Visibility       string `json:"visibility"`
	Status           string `json:"status"`
	LanguageCode     string `json:"language_code"`
	EstimatedMinutes int    `json:"estimated_minutes"`
}

type UpdateFlashcardSetInput struct {
	CourseID         *string `json:"course_id"`
	Title            *string `json:"title"`
	Description      *string `json:"description"`
	Visibility       *string `json:"visibility"`
	Status           *string `json:"status"`
	LanguageCode     *string `json:"language_code"`
	EstimatedMinutes *int    `json:"estimated_minutes"`
}

type CreateFlashcardInput struct {
	Position    int    `json:"position"`
	Question    string `json:"question"`
	Answer      string `json:"answer"`
	Explanation string `json:"explanation"`
	Hint        string `json:"hint"`
}

type UpdateFlashcardInput struct {
	Position    *int    `json:"position"`
	Question    *string `json:"question"`
	Answer      *string `json:"answer"`
	Explanation *string `json:"explanation"`
	Hint        *string `json:"hint"`
}
