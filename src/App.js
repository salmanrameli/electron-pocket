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
            const key = getConsumerKey()
            const oauth = getOauthUrl()
            const redirect = getRedirectUri()

            Axios({
                method: 'post',
                url: oauth,
                headers: {
                    'content-type': 'application/json',
                },
                params: {
                    'consumer_key': key,
                    'redirect_uri': redirect
                }
            }).then((response) => {
                let code = response.data

                store.set('request_token', code.substring(5))

                store.set('needAuthentication', false)

                ipcRenderer.send('open-auth-url', code.substring(5), redirect)
            })
        } else {
            const key = getConsumerKey()
            const token = store.get('request_token')
            const authorizeUrl = getAuthorizeUrl();

            Axios({
                method: 'post',
                url: authorizeUrl,
                headers: {
                    'content-type': 'application/json',
                },
                params: {
                    'consumer_key': key,
                    'code': token
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
        const key = getConsumerKey()
        const token = store.get('access_token')
        const authorizeUrl = getArticlesUrl();

        Axios({
            method: 'post',
            url: authorizeUrl,
            headers: {
                'content-type': 'application/json',
            },
            params: {
                'consumer_key': key,
                'access_token': token
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