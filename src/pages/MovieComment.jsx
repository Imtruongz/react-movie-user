import React, { useContext, useEffect, useState } from 'react';
import Container from '../components/Container';

import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import TextAvatar from '../components/TextAvatar';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Button,
	Stack,
	TextField,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from '@mui/material';
import { getCommentByMoviID } from '../services/movieService';
import { UserContext } from '../context/UserContext';
import { handleCreateComment, handleDeleteComment } from '../services/commentService';
import { toast } from 'react-toastify';

function MovieComment({ movieID }) {
	const { user } = useContext(UserContext);
	const [comments, setComments] = useState([]);
	const [visibleComments, setVisibleComments] = useState(3);
	const [userName, setUserName] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [content, setContent] = useState('');
	const [userID, setUserID] = useState();
	const commentLength = comments.length;

	const loadMoreComments = () => {
		setVisibleComments(visibleComments + 3);
	};

	const renderAvatar = (text) => (
		<ListItemAvatar>
			<TextAvatar text={text} />
		</ListItemAvatar>
	);

	const fetchComment = async () => {
		try {
			const response = await getCommentByMoviID(movieID);
			setComments(response.comments);
		} catch (error) {
			console.log(error);
		}
	};

	const createComment = async () => {
		try {
			const newComment = await handleCreateComment(userEmail, movieID, content);
			setComments([...comments, newComment.createdComment]);
			setContent('');
			toast.success('Comment thành công');
		} catch (error) {
			console.log(error);
		}
	};

	const deleteComment = async(commentID)=>{
		try {
			await handleDeleteComment(commentID)
			fetchComment()
			toast.success('Xóa bình luận thành công')
		} catch (error) {
			console.log(error)
		}
	}

	const renderComment = (comment) => {
		const lastName =
			comment.userName.split(' ')[comment.userName.split(' ').length - 1];
		return (
			<ListItem
				key={userName + comment.commentDate}
				className="hover:bg-[#131313]">
				{renderAvatar(lastName)}
				<ListItemText>
					<Typography variant="h6" fontWeight="700">
						{comment.userName}
					</Typography>
					<Typography fontSize={13}>{comment.commentDate}</Typography>
					<Typography variant="h6">{comment.content}</Typography>
				</ListItemText>
				{comment.userID === userID ? (
					<button className="bg-[#ff0000] px-4 py-1 rounded-sm hover:opacity-85 items-center flex text-base" onClick={()=>deleteComment(comment.commentID)}>
						<DeleteIcon fontSize="small" />
						Xóa
					</button>
				) : (
					<></>
				)}
			</ListItem>
		);
	};

	useEffect(() => {
		fetchComment();
		const userData = sessionStorage.getItem('userData');
		if (userData) {
			const parsedUserData = JSON.parse(userData);
			const lastName =
				parsedUserData.account.fullName.split(' ')[
					parsedUserData.account.fullName.split(' ').length - 1
				];
			setUserName(lastName);

			const email = parsedUserData.account.email;
			setUserEmail(email);

			setUserID(parsedUserData.account.userID);
		}
	}, [movieID || comments]);

	return (
		<>
			<Container header={`Bình luận phim (${commentLength})`}>
				<List sx={{ width: '100%', bgcolor: 'black' }}>
					{comments
						.slice(0, visibleComments)
						.map((comment) => renderComment(comment))}
				</List>
				<div className="flex justify-center font-semibold">
					{visibleComments < comments.length && (
						<Button
							sx={{
								fontSize: '18px',
								color: '#ff0000',
								'&hover': {
									opacity: 0.8,
								},
							}}
							onClick={loadMoreComments}>
							Xem thêm
						</Button>
					)}
				</div>
				<Stack direction="row" spacing={2} sx={{ marginTop: '20px' }}>
					{/* cho ten usẻ vao */}
					{userName ? (
						<>
							<TextAvatar text={userName} />
							<Stack spacing={2} flexGrow={1}>
								<Typography variant="h6" fontWeight="700">
									{userName}
								</Typography>
								<TextField
									value={content}
									onChange={(e) => setContent(e.target.value)}
									multiline
									rows={4}
									placeholder="Viết bình luận của bạn"
									variant="outlined"
									fullWidth
									InputProps={{
										sx: { color: '#ffffff' },
									}}
									sx={{
										backgroundColor: '#333333',
										'& .MuiOutlinedInput-root': {
											'& fieldset': {
												borderColor: '#555555',
											},
											'&:hover fieldset': {
												borderColor: '#777777',
											},
											'&.Mui-focused fieldset': {
												borderColor: '#ff0000',
											},
										},
									}}
								/>
								<Button
									variant="contained"
									size="large"
									sx={{
										width: 'max-content',
										backgroundColor: '#ff0000',
										'&:hover': {
											opacity: 0.8,
											backgroundColor: '#ff0000',
										},
									}}
									startIcon={<SendOutlinedIcon />}
									onClick={() => createComment(userEmail, movieID, content)}>
									Đăng
								</Button>
							</Stack>
						</>
					) : (
						<div>
							Nếu bạn muốn comment hãy{' '}
							<a href="/login" className="text-[#ff0000]">
								đăng nhập
							</a>
						</div>
					)}
				</Stack>
			</Container>
		</>
	);
}

export default MovieComment;
