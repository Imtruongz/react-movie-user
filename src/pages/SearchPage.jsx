import { Box, Button, Stack, TextField, Grid, debounce } from '@mui/material';
import { useEffect, useState } from 'react';

import MediaItem from '../components/MediaItem';
import { getAllMovies, searchMovieApi } from '../services/movieService';

const SearchPage = () => {
	const [valueSearch, setValueSearch] = useState('');
	const [movies, setMovies] = useState([]);

	const handleChangeInputSearch = (value) => {
		setValueSearch(value);
		debouncedHandleSearch(value);
	};

	const handleSearch = async (keyword) => {
		try {
			let response = await searchMovieApi(keyword);
			setMovies(response.movie.movieSearch);
			// setTableRows(response.movie.movieSearch);
			// setCurrentPage(1);
		} catch (error) {
			console.log(error);
		}
	};

	const fecthMovie = async () => {
		const res = await getAllMovies('ALL');
		setMovies(res.movies);
	};

	const debouncedHandleSearch = debounce(handleSearch, 300);

	useEffect(() => {
		fecthMovie();
	}, []);

	return (
		<>
			<Box
				sx={{
					margin: 'auto',
					backgroundColor: 'black',
					minHeight: '1000px',
					padding: '100px',
				}}>
				<Stack spacing={3}>
					<TextField
						value={valueSearch}
						onChange={(e) => handleChangeInputSearch(e.target.value)}
						multiline
						rows={1}
						placeholder="Nhập tên phim:"
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

					<div className="flex gap-7 flex-wrap">
						{movies.map((movie, index) => (
							<MediaItem
								key={index}
								imgUrl={movie.background}
								score={movie.imdb}
								title={movie.title}
								releaseDate={movie.release}
								movieID={movie.movieID}
							/>
						))}
					</div>

					{/* {medias.length > 0 && (
            <LoadingButton
              loading={onSearch}
              onClick={() => setPage(page + 1)}
            >
              load more
            </LoadingButton>
          )} */}
				</Stack>
			</Box>
		</>
	);
};

export default SearchPage;
