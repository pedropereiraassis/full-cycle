package utils

import "encoding/json"

func IsJson(str string) error {
	var jsonStr struct{}

	if err := json.Unmarshal([]byte(str), &jsonStr); err != nil {
		return err
	}

	return nil
}
