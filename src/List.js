import React from 'react';

const WebView = require('react-electron-web-view');

class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: this.props.lists,
            isOpen: '',
            articleId: ''
        }

        this.toggleModal = this.toggleModal.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.lists
        })
    }

    toggleModal = (e, articleId) => {
        if(articleId == null) {
            this.setState({
                articleId: null,
                isOpen: !this.state.isOpen
            });
        } else {
            this.setState({
                articleId: articleId,
                isOpen: !this.state.isOpen
            });
        }
    }

    render() {
        return(
            <div>
                {Object.keys(this.state.list).map(index => 
                    <div className="card mb-3" key={this.state.list[index].item_id}>
                        <div className="card-body cursor-pointer" onClick={(e) => this.state.isOpen ? this.toggleModal(e, null) : this.toggleModal(e, this.state.list[index].item_id)}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3>{this.state.list[index].resolved_title}</h3>
                                    <small>{this.state.list[index].excerpt}...</small>
                                </div>
                                {this.state.articleId === this.state.list[index].item_id ? 
                                    <WebView src="www.google.co.id" />
                                    :
                                    <div></div>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default List;