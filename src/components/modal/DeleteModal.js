import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './modal.css';

class DeleteModal extends Component {
	constructor(props) {
		super(props);
		this.modalRef = React.createRef();

		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	handleClickOutside(event) {
		const domNode = ReactDOM.findDOMNode(this.modalRef.current);

		if (!domNode || !domNode.contains(event.target)) {
			this.props.closeModal();
		}
	};

	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside, true);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside, true);
	}

	render() {
		return (
			<div className="modal">
				<div className="modal-content" ref={this.modalRef}>
					<div className="modal-title">שים לב</div>
					<div className="modal-body">
						{this.props.message}
					</div>
					<div className="modal-buttons">
						<button id="confirmDeleteButton" className="modal-btn" onClick={this.props.delete}>מחק</button>
						<button className="modal-btn" onClick={this.props.closeModal}>בטל</button>
					</div>
				</div>
			</div>
		);
	}
}

export default DeleteModal;