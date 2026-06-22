{
  "meta": {
    "project": "FiberSave",
    "style": "Sharp black-and-white financial command interface",
    "design_principles": [
      "No border radius anywhere",
      "Sharp rectangular geometry",
      "Institutional finance aesthetic",
      "Typography-first hierarchy",
      "Data as interface",
      "Strong grid discipline",
      "High contrast monochrome",
      "Thin dividers instead of soft cards",
      "No decorative softness"
    ]
  },

  "layout": {
    "type": "Sharp Institutional Dashboard Landing",

    "structure": [
      "Top Announcement Strip",
      "Navigation Bar",
      "Hero Statement Grid",
      "Market Metrics Row",
      "Financial Command Dashboard",
      "Feature Data Grid",
      "Security / Trust Section",
      "Final CTA Strip",
      "Footer"
    ],

    "viewport_behavior": {
      "desktop": "Wide 12-column editorial grid with sharp rectangular blocks",
      "tablet": "Two-column grid with stacked rectangular sections",
      "mobile": "Single-column vertical layout with full-width rectangular blocks"
    },

    "page_rules": {
      "container": "No visible outer rounded container",
      "background": "Full-bleed page background",
      "max_content_width": "1600px",
      "alignment": "Centered internal grid",
      "padding": {
        "desktop": "32px",
        "tablet": "24px",
        "mobile": "16px"
      },
      "section_gap": {
        "desktop": "0px or 1px divider-based spacing",
        "tablet": "0px or 1px divider-based spacing",
        "mobile": "0px or 1px divider-based spacing"
      },
      "grid": {
        "columns": 12,
        "gap": "0px",
        "divider_based": true
      }
    }
  },

  "shape_system": {
    "global_rule": "No rounded corners anywhere in the interface",

    "radius": {
      "all_components": "0px",
      "cards": "0px",
      "buttons": "0px",
      "inputs": "0px",
      "modals": "0px",
      "dropdowns": "0px",
      "badges": "0px",
      "avatars": "0px",
      "tooltips": "0px",
      "dashboard_widgets": "0px",
      "navigation_items": "0px"
    },

    "allowed_shapes": [
      "Rectangle",
      "Square",
      "Straight divider line",
      "Grid cell",
      "Sharp table row",
      "Sharp data block"
    ],

    "forbidden_shapes": [
      "Rounded card",
      "Pill button",
      "Capsule badge",
      "Circular avatar",
      "Rounded modal",
      "Rounded input",
      "Blob",
      "Soft organic shape"
    ]
  },

  "color_system": {
    "primary": {
      "50": "#F8F8F8",
      "100": "#EAEAEA",
      "200": "#D6D6D6",
      "300": "#B0B0B0",
      "400": "#808080",
      "500": "#5A5A5A",
      "600": "#3D3D3D",
      "700": "#252525",
      "800": "#121212",
      "900": "#000000"
    },

    "secondary": {
      "50": "#FFFFFF",
      "100": "#FAFAFA",
      "200": "#F3F3F3",
      "300": "#E5E5E5",
      "400": "#CCCCCC",
      "500": "#999999",
      "600": "#666666",
      "700": "#444444",
      "800": "#222222",
      "900": "#111111"
    },

    "accent": {
      "divider_dark": "#1A1A1A",
      "divider_light": "#E8E8E8",
      "muted_dark": "#666666",
      "muted_light": "#777777",
      "positive_dark": "#FFFFFF",
      "positive_light": "#000000",
      "negative_dark": "#A3A3A3",
      "negative_light": "#555555"
    }
  },

  "dark_mode": {
    "background": "#000000",
    "surface": "#050505",
    "surface_secondary": "#0A0A0A",
    "surface_elevated": "#111111",
    "surface_inverse": "#FFFFFF",
    "text_primary": "#FFFFFF",
    "text_secondary": "#9D9D9D",
    "text_muted": "#666666",
    "border": "#1A1A1A",
    "border_strong": "#2A2A2A",
    "button_primary_background": "#FFFFFF",
    "button_primary_text": "#000000",
    "button_secondary_background": "#000000",
    "button_secondary_text": "#FFFFFF"
  },

  "light_mode": {
    "background": "#FFFFFF",
    "surface": "#FAFAFA",
    "surface_secondary": "#F3F3F3",
    "surface_elevated": "#FFFFFF",
    "surface_inverse": "#000000",
    "text_primary": "#000000",
    "text_secondary": "#555555",
    "text_muted": "#777777",
    "border": "#E8E8E8",
    "border_strong": "#D6D6D6",
    "button_primary_background": "#000000",
    "button_primary_text": "#FFFFFF",
    "button_secondary_background": "#FFFFFF",
    "button_secondary_text": "#000000"
  },

  "navigation": {
    "height": "80px",

    "layout": {
      "left": "Sharp wordmark area",
      "center": "Horizontal navigation links",
      "right": "Account actions"
    },

    "style": {
      "background": "page background",
      "border_bottom": "1px solid mode border token",
      "radius": "0px",
      "shadow": "none"
    },

    "links": {
      "items": [
        "Home",
        "Solutions",
        "Pricing",
        "Resources"
      ],
      "gap": "40px",
      "text_size": "14px",
      "weight": 500
    },

    "mobile": {
      "behavior": "Logo left, sharp square menu button right",
      "drawer": "Full-width rectangular menu panel with 0px radius"
    }
  },

  "hero": {
    "layout": "Sharp Editorial Grid",

    "composition": {
      "left": {
        "width": "65%",
        "content": [
          "eyebrow",
          "headline",
          "description",
          "cta"
        ]
      },

      "right": {
        "width": "35%",
        "content": [
          "market_snapshot",
          "account_balance",
          "daily_change",
          "transfer_status"
        ]
      }
    },

    "container_style": {
      "background": "transparent or surface",
      "border_bottom": "1px solid mode border token",
      "radius": "0px",
      "padding": {
        "desktop": "96px 0",
        "tablet": "72px 0",
        "mobile": "56px 0"
      }
    },

    "headline": {
      "desktop": {
        "size": "112px",
        "line_height": "0.9",
        "weight": 600,
        "tracking": "-0.08em"
      },

      "tablet": {
        "size": "76px",
        "line_height": "0.94"
      },

      "mobile": {
        "size": "44px",
        "line_height": "1"
      }
    },

    "description": {
      "max_width": "560px",
      "size": {
        "desktop": "18px",
        "mobile": "16px"
      },
      "line_height": 1.7
    },

    "cta_group": {
      "layout": "Horizontal on desktop, stacked on mobile",
      "spacing_top": "40px",
      "gap": "12px"
    }
  },

  "metrics_strip": {
    "position": "Directly below hero",

    "layout": {
      "desktop": "4 equal rectangular cells",
      "tablet": "2 columns",
      "mobile": "1 column"
    },

    "card_style": {
      "background": "surface",
      "border": "1px solid mode border token",
      "radius": "0px",
      "padding": "32px",
      "min_height": "180px",
      "shadow": "none"
    },

    "content": [
      "Assets Under Management",
      "Transaction Volume",
      "Verified Accounts",
      "Countries Supported"
    ],

    "number_style": {
      "size": {
        "desktop": "56px",
        "mobile": "40px"
      },
      "weight": 600,
      "tracking": "-0.04em"
    },

    "label_style": {
      "size": "12px",
      "uppercase": true,
      "tracking": "0.12em"
    }
  },

  "financial_dashboard_grid": {
    "layout": {
      "desktop": "Asymmetric rectangular data grid",
      "tablet": "Two-column rectangular grid",
      "mobile": "Single-column stacked rectangular panels"
    },

    "blocks": {
      "portfolio_chart": {
        "span": "7 columns",
        "height": "460px",
        "radius": "0px",
        "purpose": "Show monochrome portfolio performance chart"
      },

      "transaction_feed": {
        "span": "5 columns",
        "height": "460px",
        "radius": "0px",
        "purpose": "Show recent payments and transfers"
      },

      "card_preview": {
        "span": "4 columns",
        "height": "320px",
        "radius": "0px",
        "purpose": "Show sharp rectangular virtual card preview"
      },

      "global_accounts": {
        "span": "4 columns",
        "height": "320px",
        "radius": "0px",
        "purpose": "Show multi-currency account summary"
      },

      "risk_status": {
        "span": "4 columns",
        "height": "320px",
        "radius": "0px",
        "purpose": "Show security and compliance status"
      }
    },

    "visual_rules": {
      "charts": "Thin monochrome lines only",
      "tables": "Subtle row dividers",
      "icons": "Minimal outline icons with square containers only",
      "empty_states": "Soft gray text and thin borders",
      "shadow": "none"
    }
  },

  "feature_blocks": {
    "layout": {
      "desktop": "3-column rectangular grid",
      "tablet": "2-column rectangular grid",
      "mobile": "1-column rectangular grid"
    },

    "items": [
      {
        "title": "Global Accounts",
        "description": "Hold, send, and receive money across multiple currencies from a unified account system."
      },
      {
        "title": "Smart Cards",
        "description": "Create physical and virtual cards with spending rules, limits, and real-time controls."
      },
      {
        "title": "Treasury Control",
        "description": "Track cash flow, balances, and operational spending through a clean finance command center."
      }
    ],

    "card_style": {
      "min_height": "300px",
      "padding": "40px",
      "radius": "0px",
      "border": "1px solid mode border token",
      "background": "surface",
      "shadow": "none"
    }
  },

  "security_trust_blocks": {
    "layout": {
      "desktop": "Large left trust statement + right certification grid",
      "tablet": "Stacked two-column rectangular blocks",
      "mobile": "Single-column"
    },

    "elements": [
      "Compliance badges",
      "Partner logos",
      "Security certifications",
      "Coverage statistics",
      "Encryption statement",
      "Fraud monitoring"
    ],

    "style": {
      "background": "transparent grid section",
      "block_background": "surface",
      "radius": "0px",
      "typography": "Small uppercase labels with strong numeric proof"
    }
  },

  "dashboard_preview": {
    "style": "Sharp monochrome operating-system dashboard",

    "elements": [
      "Balance overview",
      "Portfolio allocation",
      "Transaction history",
      "Performance chart",
      "Card controls",
      "Currency accounts",
      "Security status"
    ],

    "visual_rules": {
      "background": "Pure monochrome",
      "borders": "Thin",
      "radius": "0px",
      "shadows": "none",
      "data_density": "Medium",
      "contrast": "High"
    }
  },

  "typography": {
    "font_style": "Modern grotesk or geometric sans-serif",

    "display": {
      "weight": 600,
      "tracking": "-0.08em"
    },

    "section_heading": {
      "desktop": {
        "size": "64px",
        "line_height": "1",
        "tracking": "-0.055em"
      },
      "mobile": {
        "size": "36px",
        "line_height": "1.08"
      }
    },

    "body": {
      "size": "18px",
      "line_height": 1.8
    },

    "caption": {
      "size": "12px",
      "uppercase": true,
      "tracking": "0.12em"
    },

    "data_number": {
      "weight": 600,
      "tracking": "-0.05em"
    }
  },

  "buttons": {
    "radius": "0px",
    "height": "56px",
    "padding_x": "28px",
    "text_transform": "uppercase",
    "letter_spacing": "0.08em",

    "primary": {
      "dark_mode": {
        "background": "#FFFFFF",
        "text": "#000000",
        "border": "#FFFFFF"
      },

      "light_mode": {
        "background": "#000000",
        "text": "#FFFFFF",
        "border": "#000000"
      }
    },

    "secondary": {
      "background": "transparent",
      "border": "1px solid currentColor",
      "text": "currentColor"
    },

    "ghost": {
      "background": "transparent",
      "border": "none",
      "text": "text_secondary"
    },

    "hover": {
      "primary": "Invert background and text",
      "secondary": "Fill with current text color and invert text",
      "ghost": "Increase text contrast"
    }
  },

  "forms_and_inputs": {
    "style": "Sharp rectangular form controls",

    "input": {
      "height": "56px",
      "radius": "0px",
      "background": "surface_secondary",
      "border": "1px solid mode border token",
      "padding_x": "18px"
    },

    "focus": {
      "border": "border_strong",
      "ring": "none"
    }
  },

  "motion": {
    "style": "Restrained institutional motion",

    "duration": {
      "fast": "120ms",
      "normal": "220ms",
      "slow": "420ms"
    },

    "easing": "cubic-bezier(0.4, 0, 0.2, 1)",

    "hover_behavior": [
      "No scale bounce",
      "No rounded transition",
      "Border becomes stronger",
      "Text opacity changes subtly",
      "Button background inversion"
    ],

    "avoid": [
      "Neon glow",
      "Bouncy animation",
      "Overly playful motion",
      "Colorful transitions",
      "Soft floating effects",
      "Rounded hover morphing"
    ]
  },

  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },

  "visual_identity": {
    "avoid": [
      "Border radius",
      "Rounded cards",
      "Pill buttons",
      "Circular avatars",
      "Color gradients",
      "Neon effects",
      "3D renders",
      "Glassmorphism",
      "Crypto-style illustrations",
      "Excessive shadows",
      "Rounded random blobs",
      "Colorful icon packs"
    ],

    "prefer": [
      "Sharp rectangular blocks",
      "Black and white data panels",
      "Monochrome charts",
      "Thin dividers",
      "Strong typography",
      "Institutional layouts",
      "Dashboard previews",
      "Financial statistics",
      "Balanced negative space",
      "High contrast UI",
      "Precise alignment"
    ]
  },

  "implementation_prompt": "```md\nCreate a professional black-and-white fintech landing page with a sharp institutional design language.\n\nThe interface must use 0px border radius everywhere. No rounded cards, no pill buttons, no circular avatars, no rounded badges, no rounded inputs, and no soft containers.\n\nThe UI should feel like an institutional financial command center, not a playful startup landing page.\n\nUse only the defined token system:\n- Primary palette for dominant backgrounds, typography contrast, and major structural hierarchy.\n- Secondary palette for surfaces, secondary panels, muted text, and layered UI blocks.\n- Accent values only for dividers, muted lines, and monochrome status states.\n\nThe visual style should be:\n- Sharp\n- Premium\n- Institutional\n- Minimal\n- Trustworthy\n- Data-driven\n- Highly structured\n\nUse straight lines, rectangular sections, thin dividers, strong typography, financial metrics, monochrome charts, and precise grid alignment to create visual interest.\n\nAvoid border radius, gradients, neon effects, glassmorphism, crypto-style illustrations, heavy shadows, playful animations, and floating decorative elements.\n\nThe page should adapt from a wide 12-column desktop grid into two-column tablet layouts and single-column mobile layouts while keeping all corners sharp and rectangular.\n\nInteractions should remain restrained and professional: stronger borders, text opacity changes, and black/white button inversion only.\n```"
}