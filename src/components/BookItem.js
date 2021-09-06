import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

export class BookItem extends Component {
	state = {
		imgURL: '',
		author: '',
		isLoaded: false
	}

	static propTypes = {
		book: PropTypes.object.isRequired
	}

	componentDidMount() {
		const { featured_media, author } = this.props.book;

		const getImageUrl = axios.get(`/wp-json/wp/v2/media/${featured_media}`);

		const getAuthor = axios.get(`/wp-json/wp/v2/users/${author}`);

		Promise.all([getImageUrl, getAuthor]).then( res => {
			this.setState({
				imgURL: res[0].data.media_details.sizes.full.source_url,
				author: res[1].data.name,
				isLoaded: true
			});
		});
	}

	render() {
		const { id, title, excerpt } = this.props.book;
		const { author, imgURL, isLoaded } = this.state;
		if(isLoaded){
			return (
				<div style={{ width: '33%', margin: '0 auto', display: 'inline-block', padding: '30px'}}>
					<h2 style={{ marginBottom: '0'}}>{title.rendered}</h2>
					<small>Review by <strong>{ author }</strong> </small>
					<img style={{ maxWidth: '50%', paddingTop: '20px' }} src={ imgURL } alt={ title.rendered } />
					<div dangerouslySetInnerHTML={{ __html: excerpt.rendered }} />
					<Link to={`/book/${id}`}>Read Review &raquo;</Link>
				</div>
			);
		}
		return null;
	}
}


export default BookItem