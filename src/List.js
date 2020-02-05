import React from 'react';

const ipcRenderer = window.ipcRenderer;

class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: this.props.lists,
            isOpen: '',
            articleId: ''
        }

        this.openArticle = this.openArticle.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.lists
        })
    }

    openArticle(e, resolvedUrl) {
        ipcRenderer.send('open-article', resolvedUrl)
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
                    <div className="card mb-3 cursor-pointer" key={this.state.list[index].item_id}>
                        <img className="card-img-top" src={this.state.list[index].top_image_url} alt={this.state.list[index].resolved_title} style={{ maxHeight: '45vh', width: '100%', filter: 'brightness(0.5)' }}></img>
                        <div className="card-img-overlay text-white">
                            <div onClick={(e) => this.openArticle(e, this.state.list[index].resolved_url)}>
                                <h3 className="card-title">{this.state.list[index].resolved_title}</h3>
                                <p className="card-text text-justify">{this.state.list[index].excerpt}...</p>
                                <small className="card-text pull-down">~{this.state.list[index].time_to_read} minutes to read</small>
                            </div>
                            <div className="float-right pr-3">
                                <div className="dropdown pull-down">
                                    <button className="btn btn-sm btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item">Action</a>
                                        <a className="dropdown-item">Another action</a>
                                        <a className="dropdown-item">Something else here</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default List;