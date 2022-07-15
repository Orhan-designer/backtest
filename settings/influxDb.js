'use strict';

const { InfluxDB } = require('@influxdata/influxdb-client')
const influxToken = require('./../influxDb-token');

const token = influxToken;
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'


const client = new InfluxDB({ url, token })

module.exports = client;