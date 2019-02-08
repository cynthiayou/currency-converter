const path = require('path');
const axios = require('axios');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map((country) => country.name);
    } catch (e){
        throw new Error(`Unable to get countries that use ${currencyCode}.`)
    }
   
};

const getExchangeRate = async (from, to, amount) => {
    try {
        const response = await axios.get('http://data.fixer.io/api/latest?access_key=08bf0107cac8f458a9ec847ae63f1574');
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
        console.log("convertedAmount: ", convertedAmount);
        // if (isNaN(rate)) {
        //     throw new Error();
        // }
        const countries = await getCountries(to);
        return {
            amount: convertedAmount,
            message:  `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`
        };       

    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
    }    
};



io.on('connection', (socket) => {
    console.log("Connected");
    socket.on('task', function(data){
        console.log("received data : ", data);
        getExchangeRate(data.fromCurrency, data.toCurrency, data.fromAmount).then((result) => {
            console.log(result.amount, result.message);
            socket.emit('result', result);
        }).catch((e) => {
            console.log(e.message);
        });               
    });
});


server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
})
 

  