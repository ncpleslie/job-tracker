package config

import (
	"log"
	"os"
	"time"

	"github.com/caarlos0/env/v10"
	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

// Config represents the configuration settings for the application, loaded from environment variables.
//
// Fields:
//   - Screenshots: The configuration settings for taking screenshots of websites.
type Config struct {
	Screenshot ScreenshotConfig `yaml:"screenshot"`
	Server     ServerConfig     `yaml:"server"`
	Firebase   FirebaseConfig   `yaml:"firebase"`
}

// FirebaseConfig represents the configuration settings for the firebase app.
//
// Fields:
//   - StorageBucket: The name of the storage bucket.
//   - ProjectID: The project ID.
//   - CredentialsBase64: The base64 encoded credentials for the firebase app.
type FirebaseConfig struct {
	StorageBucket     string `yaml:"storageBucket"`
	ProjectID         string `yaml:"projectId"`
	CredentialsBase64 string `yaml:"credentialsBase64" env:"CREDENTIALS_BASE64"`
}

// ServerConfig represents the configuration settings for the server.
//
// Fields:
//   - Port: The port the server listens on.
//   - Host: The host the server listens on.
type ServerConfig struct {
	Port string `yaml:"port"`
	Host string `yaml:"host"`
}

// ScreenshotConfig represents the configuration settings for taking screenshots of websites.
//
// Fields:
//   - Width: The width of the screenshot.
//   - Height: The height of the screenshot.
//   - Delay: The delay before taking the screenshot.
//   - EndDelay: The delay after taking the screenshot.
//   - Retries: The number of retries to take the screenshot.
type ScreenshotConfig struct {
	Width       int64         `yaml:"width"`
	Height      int64         `yaml:"height"`
	Delay       time.Duration `yaml:"delayInSeconds"`
	EndDelay    time.Duration `yaml:"endDelayInSeconds"`
	Retries     int           `yaml:"retries"`
	HeadlessUrl string        `yaml:"headlessUrl"`
}

// generateConfig loads configuration settings from configuration variables.
//
// Returns:
//   - Config: The configuration settings for the application.
//
// Note: The function panics if there is an error loading the .yml file.
func MustGenerateConfig() Config {
	f, err := os.Open("config.yaml")
	if err != nil {
		log.Fatalf(err.Error())
	}
	defer f.Close()

	var cfg Config
	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&cfg)
	if err != nil {
		log.Fatalf("Error generating yaml config: %s", err.Error())
	}

	err = godotenv.Load()
	if err != nil {
		log.Printf("Error loading env file but will continue: %s", err.Error())
	}

	err = env.Parse(&cfg)
	if err != nil {
		log.Fatalf("Error generating env config: %s", err.Error())
	}

	return cfg
}
