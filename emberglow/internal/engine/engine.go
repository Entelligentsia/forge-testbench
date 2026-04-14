// Package engine executes parsed .ember recipes against device drivers.
package engine

import (
	"fmt"
	"github.com/entelligentsia/emberglow/internal/dsl"
)

// Engine holds the runtime state for a running recipe.
type Engine struct {
	recipe *dsl.Recipe
}

// New creates a new Engine for the given recipe.
func New(recipe *dsl.Recipe) *Engine {
	return &Engine{recipe: recipe}
}

// Run starts the engine event loop.
func (e *Engine) Run() error {
	fmt.Printf("▶ Running recipe: %s\n", e.recipe.Name)
	fmt.Printf("  %d devices, %d rules\n\n", len(e.recipe.Devices), len(e.recipe.Rules))

	for _, rule := range e.recipe.Rules {
		fmt.Printf("  [rule] %s → listening for %s:%s\n",
			rule.Name, rule.When.Device, rule.When.Event)
	}
	fmt.Println("\n  Engine ready — waiting for events (Ctrl+C to stop)")
	// Real event loop would subscribe to device drivers here.
	select {}
}

// ListDevices prints all supported device types.
func ListDevices() {
	drivers := []struct{ name, desc string }{
		{"hue_bulb", "Philips Hue colour bulb (local bridge API)"},
		{"smart_plug", "Generic smart plug via local REST"},
		{"motion_sensor", "PIR motion sensor (MQTT)"},
		{"thermostat", "Smart thermostat (ecobee / Nest local API)"},
		{"virtual_clock", "Software clock trigger — fires at given HH:MM"},
		{"webhook", "Outbound HTTP webhook action device"},
		{"scene", "Logical scene group — trigger multiple rules together"},
	}
	fmt.Println("Supported device types:")
	for _, d := range drivers {
		fmt.Printf("  %-20s %s\n", d.name, d.desc)
	}
}
