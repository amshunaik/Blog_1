const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'mlaxeDmmr2eqdBaMYU4X8RaKdrBGorhQ',
    socket: {
        host: 'redis-17597.c10.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 17597
    }
});

client.on('error', err => console.log('Redis Client Error', err));

 client.connect();

 client.set('foo', 'bar');
const result =  client.get('foo');
console.log(result)  // >>> bar

module.exports=client;

