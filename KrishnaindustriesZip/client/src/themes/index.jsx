import { createTheme } from '@mui/material/styles';

// assets
import colors from 'assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';
import { borderRadius, width } from '@mui/system';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  const color = colors;

  // Define your custom colors here
  const darkSkyBlue = '#A4Add9A9'; // Dark sky blue color

  // Define a clean and attractive color scheme
  const themeOption = {
    colors: color,
    heading: '#003366', // navy blue for headings
    paper: '#ffffff', // white for paper background
    backgroundDefault: '#e0f7fa', // sky blue for default background
    background: '#ffffff', // white for general background
    darkTextPrimary: '#003366', // navy blue for primary text
    darkTextSecondary: '#007bb2', // sky blue for secondary text
    textDark: '#444', // navy blue for text
    menuSelected: '#007bb2', // sky blue for selected menu items
    menuSelectedBack: '#87ceeb', // navy blue for selected background
    divider: '#cccccc', // light grey for dividers
    customization,
    darkSkyBlue // Add the custom color to the theme options
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  // Custom component styles
  themes.components.MuiPaper = {
    styleOverrides: {
      root: {
        backgroundColor: themeOption.paper, // background color
        color: themeOption.textDark, // dark text color
        borderRadius: '20px'
      }
    }
  };

  themes.components.MuiTableCell = {
    styleOverrides: {
      head: {
        backgroundColor: darkSkyBlue, // dark sky blue for table head background
        color: themeOption.textDark, // dark text color
        fontWeight: 'bolder'
      },
      body: {
        color: themeOption.textDark, // dark text color
        fontWeight: 'bolder',
        fontSize: '13px'
      }
    }
  };

  themes.components.MuiButton = {
    styleOverrides: {
      root: {
        background: 'linear-gradient(45deg, #008080 30%, #004d4d 90%)', // Teal gradient
        color: '#ffffff', // Text color
        borderRadius: '8px', // Rounded corners
        padding: '10px 20px', // Padding
        marginBottom: '5px',
        textTransform: 'none', // Preserve text casing
        boxShadow: '0 3px 5px 2px rgba(0, 128, 128, 0.3)', // Teal shadow
        minWidth: '120px', // Minimum width to ensure consistency
        width: 'auto', // Automatically adjusts to text length
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transitions
        '&:hover': {
          background: 'linear-gradient(45deg, #004d4d 30%, #008080 90%)', // Reverse gradient on hover
          boxShadow: '0 6px 10px 4px rgba(0, 128, 128, 0.5)', // Enhanced shadow on hover
          transform: 'translateY(-3px)' // Slight lift on hover
        },
        '&:active': {
          background: 'linear-gradient(45deg, #003333 30%, #006666 90%)', // Darker teal for active state
          boxShadow: '0 4px 8px rgba(0, 128, 128, 0.6)', // Deeper shadow for active state
          transform: 'translateY(1px)' // Slight downward movement on click
        },
        '&:disabled': {
          background: 'linear-gradient(45deg, #cccccc 30%, #aaaaaa 90%)', // Grayed-out gradient for disabled state
          color: '#666666', // Gray text for disabled state
          boxShadow: 'none', // No shadow for disabled
          transform: 'none' // No transform for disabled
        }
      }
    }
  };

  themes.components.MuiDialog = {
    styleOverrides: {
      paper: {
        backgroundColor: themeOption.paper, // Background color based on theme
        color: themeOption.textDark, // Text color for contrast
        borderRadius: '12px', // Rounded corners for a softer look
        padding: '20px', // Padding for spacing
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
        transition: 'transform 0.3s ease, opacity 0.3s ease', // Smooth transition effects
        maxWidth: '800px', // Optimal width for content readability
        width: '90%', // Responsive design, adjusts to screen size
        outline: 'none', // Remove default outline
        '&:focus': {
          outline: '2px solid #66a6ff' // Custom outline for accessibility
        }
      },
      root: {
        '& .MuiDialogContent-root': {
          color: themeOption.textDark, // Ensure dark text for readability
          fontSize: '16px', // Comfortable font size
          lineHeight: '1.6', // Proper line height
          padding: '16px 0' // Vertical padding for better spacing
        },
        '& .MuiDialogActions-root': {
          padding: '16px 24px', // Padding around action buttons
          justifyContent: 'flex-end', // Align actions to the right
          '& button': {
            marginLeft: '8px', // Spacing between buttons
            padding: '10px 16px', // Button padding for larger clickable area
            borderRadius: '6px', // Rounded corners for buttons
            transition: 'background-color 0.3s ease, transform 0.2s ease', // Button transition effects
            '&:hover': {
              backgroundColor: '#66a6ff', // Button hover color
              transform: 'scale(1.05)' // Slight scaling effect on hover
            },
            '&:active': {
              transform: 'scale(0.95)' // Button scale down on click
            }
          }
        }
      },
      // Styles for dialog title
      title: {
        '& .MuiDialogTitle-root': {
          color: themeOption.textPrimary, // Primary color for title
          fontSize: '20px', // Larger title font size
          fontWeight: '600', // Emphasize the title
          padding: '16px 24px', // Spacing around the title
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)' // Divider for separation
        }
      },
      // Responsive adjustments
      '@media (max-width: 600px)': {
        paper: {
          maxWidth: '100%', // Full width on smaller screens
          borderRadius: '8px', // Slightly less rounded on small screens
          padding: '16px' // Adjust padding for smaller devices
        }
      }
    }
  };

  themes.components.MuiAppBar = {
    styleOverrides: {
      root: {
        backgroundColor: themeOption.menuSelected, // sky blue for the app bar
        color: themeOption.textDark // dark text color
      }
    }
  };

  themes.components.MuiDrawer = {
    styleOverrides: {
      paper: {
        // backgroundColor: themeOption.backgroundDefault, // sky blue background for drawer
        // color: themeOption.textDark, // dark text color
        fontWeight: 'bolder'
      }
    }
  };

  themes.components.MuiTableRow = {
    styleOverrides: {
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#f0f0f0' // very light grey for odd rows
        },
        '&:hover': {
          backgroundColor: '#e0f7fa', // sky blue for hover effect
          transition: 'background-color 0.3s' // smooth transition for hover effect
        }
      }
    }
  };

  themes.components.MuiTableHead = {
    styleOverrides: {
      root: {
        backgroundColor: darkSkyBlue, // dark sky blue for table head background
        '& .MuiTableCell-root': {
          color: themeOption.textDark // dark text color for table head cells
        }
      }
    }
  };
  themes.components.MuiInput = {
    styleOverrides: {
      root: {
        borderRadius: '8px', // Rounded corners for a modern look
        backgroundColor: '#ffffff', // White background for inputs
        border: '1px solid rgba(0, 0, 0, 0.2)', // Light border for definition
        padding: '12px 16px', // Padding for comfort
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease', // Smooth transitions
        '&:focus': {
          borderColor: '#66a6ff', // Change border color on focus
          boxShadow: '0 0 5px rgba(102, 166, 255, 0.5)', // Shadow for focus indication
          outline: 'none' // Remove default outline
        },
        '&:hover': {
          borderColor: '#66a6ff' // Change border color on hover
        },
        '&.Mui-disabled': {
          backgroundColor: '#f5f5f5', // Light grey for disabled inputs
          borderColor: 'rgba(0, 0, 0, 0.1)' // Lighter border for disabled state
        }
      },
      input: {
        fontSize: '16px', // Comfortable font size
        lineHeight: '1.5', // Adequate line height for readability
        color: '#333' // Dark text color for input
      },
      // Styles for InputLabel
      inputLabel: {
        fontSize: '14px', // Label font size
        color: 'rgba(0, 0, 0, 0.6)', // Lighter color for labels
        marginBottom: '8px', // Space below label
        '&.Mui-focused': {
          color: '#66a6ff' // Change color on focus
        }
      },
      // Styles for FormHelperText
      helperText: {
        fontSize: '12px', // Helper text font size
        color: '#666', // Color for helper text
        marginTop: '4px' // Space above helper text
      }
    }
  };

  // Update for TextField (input with label)
  themes.components.MuiTextField = {
    styleOverrides: {
      root: {
        margin: '16px 0' // Margin for spacing between fields
      }
    }
  };

  return themes;
};

export default theme;
