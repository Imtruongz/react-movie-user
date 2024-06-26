import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useContext, useEffect, useState } from 'react';

import { Box, Button, Stack, Typography, alpha } from '@mui/material';

import CircularRate from '../components/CircularRate';
import Container from '../components/Container';
import MovieComment from './MovieComment';

import uiConfigs from '../config/ui.configs';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useParams } from 'react-router-dom';
import {
	getAllActorsMovie,
	getAllCountries,
	getAllDirectorsMovie,
	getAllMovies,
} from '../services/movieService';
import { getAllDirectors } from '../services/directorService';
import { getAllActors } from '../services/actorService';
import MediaSlider from '../components/MediaSlider';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import {
	handleAddFavouriteMovie,
	handleDeleteFavouriteMovie,
	handleGetFavouriteMovie,
} from '../services/userService';

const MediaDetail = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState({});
	const [director, setDirector] = useState();
	const [country, setCountry] = useState();
	const [actors, setActors] = useState([]);
	const [clickFavour, setClickFavour] = useState(false);

	const userData = sessionStorage.getItem('userData');
	if (userData) {
		const parsedUserData = JSON.parse(userData);
		var email = parsedUserData.account.email;
	}

	const fetchMovieById = async () => {
		try {
			const response = await getAllMovies(id);
			setMovie(response.movies);

			// * Director
			const responseDirector = await getAllDirectorsMovie(id);
			const directorsMovie = responseDirector.moviedirectors.map(
				(director) => director.directorID
			);
			const responseDirectorsMovie = await getAllDirectors(directorsMovie);
			setDirector(responseDirectorsMovie.directors.name);

			// * Country
			const responseCountry = await getAllCountries(response.movies.countryID);
			setCountry(responseCountry.countries.countryName);

			// * Actor

			const responseActor = await getAllActorsMovie(id);
			const actorIDs = responseActor.movieactors.map((actor) => actor.actorID);

			const actorsDetails = await Promise.all(
				actorIDs.map(async (actorID) => {
					const responseActorsMovie = await getAllActors(actorID);
					return responseActorsMovie.actors;
				})
			);

			const flattenedActors = actorsDetails.flat();
			setActors(flattenedActors);
		} catch (error) {
			console.log(error);
		}
	};

	const addFavouriteMovie = async () => {
		toast.success('Đã thêm phim vào danh sách yêu thích');
		await handleAddFavouriteMovie(email, id);
	};

	const deleteFavouriteMovie = async () => {
		toast.info('Đã xóa khỏi danh sách yêu thích');
		await handleDeleteFavouriteMovie(email, id);
	};

	const onClickFavour = () => {
		if (userData) {
			setClickFavour(!clickFavour);
			clickFavour === false ? addFavouriteMovie() : deleteFavouriteMovie();
		} else {
			toast.warn('Bạn cần đăng nhập để thực hiện chức năng này!');
		}
	};

	const favouriteMovie = async () => {
		const response = await handleGetFavouriteMovie(email);

		const arr = response.favourMovies;
		if (userData) {
			const idExists = arr.some((ele) => ele.movieID === Number(id));
			if (idExists) {
				setClickFavour(true);
			} else {
				setClickFavour(false);
			}
		}
	};

	useEffect(() => {
		fetchMovieById();
		favouriteMovie();
	}, [id]);

	return (
		<>
			<Box
				sx={{
					zIndex: '-1',
					position: 'relative',
					paddingTop: { xs: '60%', sm: '40%', md: '35%' },
					backgroundPosition: 'top',
					backgroundSize: 'cover',
					backgroundImage: `url(${movie.thumbnail})`,
					backgroundAttachment: 'fixed',
					'&::before': {
						content: '""',
						position: 'absolute',
						left: 0,
						bottom: 0,
						width: '100%',
						height: '100%',
						pointerEvents: 'none',
						backgroundImage:
							'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
					},
				}}
			/>
			<Box
				sx={{
					color: 'white',
					maxWidth: '100%',
					margin: 'auto',
					padding: 20,
					bgcolor: 'black',
				}}>
				{/* media content */}
				<Box
					sx={{
						marginTop: { xs: '-10rem', md: '-15rem', lg: '-20rem' },
					}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { md: 'row', xs: 'column' },
						}}>
						{/* poster */}
						<Box
							sx={{
								width: { xs: '70%', sm: '50%', md: '40%' },
								margin: { xs: '0 auto 2rem', md: '0 2rem 0 0' },
							}}>
							<Box
								sx={{
									paddingTop: '140%',
									position: 'relative',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundColor: 'darkgrey',
									backgroundImage: `url(${movie.background})`,
									borderRadius: '8px',
								}}
							/>
						</Box>
						{/* poster */}

						{/* media info */}
						<Box
							sx={{
								width: { xs: '100%', md: '60%' },
								color: 'white',
							}}>
							<Stack spacing={3}>
								{/* title */}
								<Typography
									variant="h4"
									fontSize={{ xs: '2rem', md: '1rem', lg: '3rem' }}
									fontWeight="700"
									sx={{ ...uiConfigs.style.typoLines(2, 'left') }}>
									{movie.title}
								</Typography>
								{/* title */}

								{/* rate and genres */}
								<Stack direction="row" spacing={1} alignItems="center">
									{/* rate */}
									<CircularRate value={movie.imdb} />
									{/* rate */}
									{/* genres */}

									{/* genres */}
								</Stack>
								{/* rate and genres */}
								<Stack spacing={1} direction="column">
									<Typography variant="body1" sx={{ fontSize: '14px' }}>
										Đạo diễn: {director}
									</Typography>
									<Typography variant="body1" sx={{ fontSize: '14px' }}>
										Quốc gia: {country}
									</Typography>
									<Typography variant="body1" sx={{ fontSize: '14px' }}>
										{movie.release}
									</Typography>
								</Stack>

								{/* overview */}
								<Typography
									variant="body1"
									sx={{ ...uiConfigs.style.typoLines(5), fontSize: '14px' }}>
									{movie.description}
								</Typography>
								{/* overview */}

								{/* buttons */}
								<Stack direction="row">
									<Button
										variant="text"
										sx={{
											width: 'max-content',
											'& .MuiButon-starIcon': {
												marginRight: '0',
											},
											color: '#ff0000',
											paddingLeft: '20px',
										}}
										size="large"
										startIcon={
											clickFavour ? <FavoriteIcon /> : <FavoriteBorderIcon />
										}
										loadingPosition="start"
										onClick={() => onClickFavour()}
									/>

									<Button
										variant="contained"
										sx={{
											fontSize: '13px',
											backgroundColor: '#ff0000',
											'&:hover': {
												backgroundColor: alpha('#ff0000', 0.8),
											},
										}}>
										Xem ngay
									</Button>
									{/* </Link> */}
								</Stack>
								{/* buttons */}

								{/* cast */}
								<Container header="Diễn viên">
									<Box
										sx={{
											'& .swiper-slide': {
												width: { xs: '50%', md: '25%', lg: '20.5%' },
												color: 'primary.contrastText',
											},
										}}>
										<Swiper
											spaceBetween={10}
											slidesPerView={'auto'}
											grabCursor={true}
											style={{ width: '100%', height: 'max-content' }}>
											{actors.map((actor, index) => (
												<SwiperSlide key={index}>
													<Link to={`/actor/${actor.actorID}`}>
														<Box
															sx={{
																paddingTop: '120%',
																color: 'text.primary',
																position: 'relative',
																backgroundSize: 'cover',
																backgroundPosition: 'center',
																backgroundColor: 'darkgrey',
																backgroundImage: `url(${actor.image})`,
																borderRadius: '8px',
															}}>
															<Box
																sx={{
																	position: 'absolute',
																	width: '100%',
																	height: 'max-content',
																	bottom: 0,
																	padding: '8px',
																	backgroundColor: 'rgba(0,0,0,0.6)',
																}}>
																<Typography className="text-white">
																	{actor.name}
																</Typography>
															</Box>
														</Box>
													</Link>
												</SwiperSlide>
											))}
										</Swiper>
									</Box>
								</Container>
								{/* cast */}
							</Stack>
						</Box>
						{/* media info */}
					</Box>
				</Box>
				{/* media content */}

				{/* media videos */}
				<div className="pt-[2rem] mb-5">
					<Container header="Trailer giới thiệu">
						<div
							dangerouslySetInnerHTML={{ __html: movie.html }}
							className="items-center"
						/>
					</Container>
				</div>
				{/* media videos */}

				{/* media reviews */}
				<MovieComment movieID={movie.movieID} />
				{/* media reviews */}

				{/* media recommendation */}
				<div className="mt-5">
					<Container header={'Có thể bạn cũng thích'}>
						<MediaSlider title={'Phim mới ra mắt'} />
					</Container>
				</div>
				{/* media recommendation */}
			</Box>
		</>
	);
};

export default MediaDetail;
