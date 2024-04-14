import PropTypes from "prop-types";


interface Event{
    id: PropTypes.int;
    extraId: PropTypes.string;
    url: PropTypes.string;
    title: PropTypes.string;
    placeName: PropTypes.string;
    address: PropTypes.string;
    contentRating: PropTypes.string;
    description: PropTypes.string;
    date: PropTypes.string;
    typeName: PropTypes.string;
    imageLink: PropTypes.string;
}

export default Event