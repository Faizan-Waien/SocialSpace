import { createTheme } from "@mui/material";

const theme = createTheme({
 
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // change color here
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // Change the border color on hover here
            color:'black',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // Maintain the border color on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'yellow', // change color here
          },
          '& .MuiInputBase-input': {
            color: 'black', // Change the text color here
            fontWeight: 'bold',
          },
          '& .MuiInputLabel-root': {
            color: 'grey', // Change the label color here
            fontWeight: 'bold',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'gray', // Change the placeholder color here
          },
          '& .MuiFormHelperText-root': {
            color: 'maroon', // Change the text helper color here
            fontWeight: 'bold',
            fontSize: 15,
          },
        },
      },
    },
  },

  typography: {
    "fontFamily": 'Rajdhani',
    },

  palette: {
    mode: 'dark',

    primary:{
        main: '#1a237e',
      },
      secondary:{
        main: '#e3f2fd'
      },
  },
});

export default theme