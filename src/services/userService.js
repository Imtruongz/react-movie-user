import axios from '../axious';
const handleLoginApi = (userEmail, userPassword) => {
	return axios.post('/api/login', {
		email: userEmail,
		password: userPassword,
	});
};

const getAllUsers = (inputID) => {
	return axios.get(`/api/user/get-all-users?id=${inputID}`, {
		userID: inputID,
	});
};

const handleSignUpApi = (userEmail, userPassword, roleID) => {
	return axios.post('/api/user/create-new-user', {
		email: userEmail,
		password: userPassword,
		roleID: roleID,
	});
};

const handleUpdateUserDataApi = (userData) => {
	console.log(userData)
	return axios.put('/api/user/edit-user', {
		user: userData,
	});
};

export {
	handleLoginApi,
	getAllUsers,
	handleSignUpApi,
	handleUpdateUserDataApi,
};
