import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk(
  'user/fetchAddres',
  async function () {
    try {
      console.log('Fetching geolocation...');

      // 1) We get the user's geolocation position
      const positionObj = await getPosition();
      console.log('Geolocation received:', positionObj);

      const position = {
        latitude: positionObj.coords.latitude,
        longitude: positionObj.coords.longitude,
      };
      console.log('Position object:', position);

      // 2) Then we use a reverse geocoding API to get a description of the user's address
      console.log('Fetching address...');
      const addressObj = await getAddress(position);
      console.log('Address received:', addressObj);

      const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;
      console.log('Formatted address:', address);

      // 3) Then we return an object with the data that we are interested in
      return { position, address };
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error; // Ensure any error is propagated correctly
    }
  }
);

const initialState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
