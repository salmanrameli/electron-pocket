import React from 'react';
import Axios from 'axios';
import { getConsumerKey, getOauthUrl, getAuthorizeUrl, getArticlesUrl, getRedirectUri } from './Constant';
import List from './List';

const ipcRenderer = window.ipcRenderer;
const Store = window.Store;
const store = new Store();

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
        }

        this.start = this.start.bind(this)
        this.getArticles = this.getArticles.bind(this)
    }

    componentDidMount() {
        this.start()
        this.getArticles()
    }

    start() {
        const needAuthentication = store.get('needAuthentication', true);

        if(needAuthentication) {
            Axios({
                method: 'post',
                url: getOauthUrl(),
                headers: {
                    'content-type': 'application/json',
                },
                params: {
                    'consumer_key': getConsumerKey(),
                    'redirect_uri': getRedirectUri()
                }
            }).then((response) => {
                let code = response.data

                store.set('request_token', code.substring(5))

                store.set('needAuthentication', false)

                ipcRenderer.send('open-auth-url', code.substring(5), getRedirectUri())
            })
        } else {
            Axios({
                method: 'post',
                url: getAuthorizeUrl(),
                headers: {
                    'content-type': 'application/json',
                },
                params: {
                    'consumer_key': getConsumerKey(),
                    'code': store.get('request_token')
                }
            }).then((response) => {
                let code = response.data
                code = code.substring(13)

                let accessToken = code.split("&");
                accessToken = accessToken[0]

                store.set('access_token', accessToken)
            }).catch(function(error) {
                if(error) {
                    store.set('needAuthentication', true)
                }
            })
        }
    }

    getArticles() {
        Axios({
            method: 'post',
            url: getArticlesUrl(),
            headers: {
                'content-type': 'application/json',
            },
            params: {
                'consumer_key': getConsumerKey(),
                'access_token': store.get('access_token')
            }
        }).then((response) => {
            this.setState({
                list: response.data.list
            })

            console.log(response.data.list)
        })
    }

    render() {
        return(
            <div>
                <h1>Rædan</h1>

                <List
                    lists = {this.state.list}
                />
            </div>
        );
    }
}

export default App;