package storage

import (
	"context"
	"log"
	"time"

	cStorage "cloud.google.com/go/storage"
	firebase "firebase.google.com/go/v4"
	storage "firebase.google.com/go/v4/storage"
)

type Storage struct {
	Log    *log.Logger
	Client *storage.Client
}

func NewClient(app *firebase.App, log *log.Logger) *Storage {
	client, err := app.Storage(context.Background())
	if err != nil {
		log.Panicln("Storage Client failed to create client: ", err.Error())
	}

	return &Storage{
		Log:    log,
		Client: client,
	}
}

func (s *Storage) UploadFile(ctx context.Context, filename string, data []byte) (string, error) {
	bucket, err := s.Client.DefaultBucket()
	if err != nil {
		return "", err
	}

	obj := bucket.Object(filename)
	w := obj.NewWriter(ctx)
	if _, err := w.Write(data); err != nil {
		log.Println("Storage: Error writing to storage: ", err.Error())
		return "", err
	}
	if err := w.Close(); err != nil {
		log.Println("Storage: Error closing storage: ", err.Error())
		return "", err
	}

	return s.GetDownloadURL(ctx, filename)
}

func (s *Storage) GetDownloadURL(ctx context.Context, filename string) (string, error) {

	bucket, err := s.Client.DefaultBucket()
	if err != nil {
		return "", err
	}

	obj := bucket.Object(filename)

	url, err := bucket.SignedURL(obj.ObjectName(), &cStorage.SignedURLOptions{
		Expires: time.Now().Add(30 * time.Minute),
		Method:  "GET",
	})
	if err != nil {
		return "", err
	}

	return url, nil
}

func (s *Storage) DeleteFile(ctx context.Context, filename string) error {
	bucket, err := s.Client.DefaultBucket()
	if err != nil {
		return err
	}

	obj := bucket.Object(filename)
	if err := obj.Delete(ctx); err != nil {
		return err
	}

	return nil
}
