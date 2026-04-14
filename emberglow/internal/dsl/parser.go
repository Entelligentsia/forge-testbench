// Package dsl parses .ember recipe files.
package dsl

import (
	"fmt"
	"gopkg.in/yaml.v3"
)

// Recipe is the top-level structure of an .ember file.
type Recipe struct {
	Name    string            `yaml:"name"`
	Version string            `yaml:"version"`
	Devices map[string]Device `yaml:"devices"`
	Rules   []Rule            `yaml:"rules"`
}

// Device declares a physical or virtual device and its driver.
type Device struct {
	Type    string            `yaml:"type"`
	Address string            `yaml:"address"`
	Options map[string]string `yaml:"options"`
}

// Rule binds a trigger to one or more actions.
type Rule struct {
	Name    string   `yaml:"name"`
	When    Trigger  `yaml:"when"`
	Then    []Action `yaml:"then"`
	Unless  *Trigger `yaml:"unless,omitempty"`
}

// Trigger describes the condition that fires a rule.
type Trigger struct {
	Device string `yaml:"device"`
	Event  string `yaml:"event"`
	Value  string `yaml:"value,omitempty"`
}

// Action describes what happens when a rule fires.
type Action struct {
	Device  string            `yaml:"device"`
	Command string            `yaml:"command"`
	Params  map[string]string `yaml:"params,omitempty"`
	Delay   string            `yaml:"delay,omitempty"`
}

// Parse deserialises an .ember YAML recipe.
func Parse(data []byte) (*Recipe, error) {
	var r Recipe
	if err := yaml.Unmarshal(data, &r); err != nil {
		return nil, fmt.Errorf("parse error: %w", err)
	}
	if r.Name == "" {
		return nil, fmt.Errorf("recipe must have a name")
	}
	return &r, nil
}

// ExampleRecipe returns a commented example .ember file as a string.
func ExampleRecipe() string {
	return `# emberglow recipe — morning_routine.ember
name: Morning Routine
version: "1.0"

devices:
  bedroom_light:
    type: hue_bulb
    address: "192.168.1.100"
    options:
      group: "bedroom"
  coffee_maker:
    type: smart_plug
    address: "192.168.1.101"
  alarm_sensor:
    type: virtual_clock
    address: "local"

rules:
  - name: Wake up lights
    when:
      device: alarm_sensor
      event: trigger
      value: "07:00"
    then:
      - device: bedroom_light
        command: set_brightness
        params:
          level: "10"
          transition: "300s"
      - device: bedroom_light
        command: set_color_temp
        params:
          kelvin: "2700"

  - name: Start coffee
    when:
      device: alarm_sensor
      event: trigger
      value: "07:00"
    then:
      - device: coffee_maker
        command: power_on
        delay: "5m"
`
}
