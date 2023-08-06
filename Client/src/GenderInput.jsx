import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function GenderInput({ gender, setUserData, handleInputs }) {

    return (
        <FormControl color='secondary' required>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
                style={{ color: 'white' }}
                row
                id='gender'
                name='gender'
                value={gender}
                onChange={handleInputs}
            >
                <FormControlLabel value="Female" control={<Radio color= 'info'/>} label="Female" />
                <FormControlLabel value="Male" control={<Radio color= 'info' /*sx={{color: '#212121',}}*/ />} label="Male" />
            </RadioGroup>
        </FormControl>
    );
}