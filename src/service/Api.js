import axios from 'axios';
class Api {
    scanEquation(text) {
        return axios.get('https://us-central1-mathlab-840d7.cloudfunctions.net/app/scan?text=' + encodeURIComponent(text))
            .then((res) => { 
                console.log(res, 'response data')
                return res.data
            })
            .catch((e) => console.error(e));
    }
 }

export default new Api;