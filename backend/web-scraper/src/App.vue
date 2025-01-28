<script setup>
import { ref } from 'vue'
//import { crawler } from './crawl.js'
// import { BasicCrawler } from 'crawlee';
// A "ref" is a reactive data source that stores a value.
// Technically, we don't need to wrap the string with ref()
// in order to display it, but we will see in the next
// example why it is needed if we ever intend to change
// the value.
// <button @click="update">Submit</button> 
const message = ref('');
const list_of_urls = ref([]);
/*
const crawler  = ref(new BasicCrawler({

async requestHandler({ pushData, request, sendRequest, log}) {
    const { url } = request;
    log.info(`Processing ${url}...`);
    const { body } = await sendRequest();

    await pushData({
        url,
        html: body,
    })
}
}))
*/
async function update() {
  list_of_urls.value.push(message.value);
  message.value = "";
  //await crawler.addRequests([message]);
  //await crawler.run();
}
</script>

<template>
  <h1>Please enter the website url. </h1>
  <br>
  <input v-model = "message">
  <button @click="update">Submit</button> 

  <br>
  <h2> {{ list_of_urls }}</h2>
</template>