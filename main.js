const axios = require('axios');
const prompt = require('prompt-sync')();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


let keyword = prompt("enter name of anime...");

// contains datatips of search results
let animeList = [];

// in order to grab proper search results, we need to find the data-tip
// the data-tip points to the poster of the anime and if we know the data-tip,
// we know which anime we are looking at and can therefore pinpoint the href
// we can then use the href to access the anime itself
// ep-status total contains the total amount of episodes and we can use that
// to display a list of episodes
/*
const document = JSDOM.fromURL(`https://aniwave.to/filter?keyword=${keyword}`)
    .then(dom => {
        console.log(dom.window.document);
    });

console.log(document);*/

axios.get(`https://aniwave.to/filter?keyword=${keyword}`)
    .then(response => {
        const dom = new JSDOM(response.data);
        let arr = [].slice.call(dom.window.document.getElementsByClassName('ani poster tip'));
        /*arr.forEach(item => {
            animeList.push(item.getAttribute('data-tip'));
        });*/

        // max 10 results
        // object will contain id, episode count, title, and link
        for (let i = 0; i < 10; i++) {
            if (arr[i] != null) {
                animeList.push({id: arr[i].getAttribute('data-tip'), name:"blah", ep_count:0, link:""});
            }
        }

        animeList.forEach(item => {
            item.ep_count = JSDOM.fragment([].slice.call(dom.window.document.querySelectorAll(`[data-tip="${item.id}"]`))[0].innerHTML).querySelector('span').innerHTML.replaceAll("</span>", "").replaceAll("<span>","").trim();
            item.name = JSDOM.fragment([].slice.call(dom.window.document.querySelectorAll(`[data-tip="${item.id}"]`))[0].innerHTML).querySelector('img').getAttribute("alt");
            item.link = JSDOM.fragment([].slice.call(dom.window.document.querySelectorAll(`[data-tip="${item.id}"]`))[0].innerHTML).querySelector('a').getAttribute('href');
            if (item.ep_count == "") {
                item.ep_count = "1";
            }
        })

        //let arr2 = [].slice.call(dom.window.document.querySelectorAll(`[data-tip="${animeList[0]}"]`))[0].getElementsByClassName('ep-status total')[0].innerHTML;

        //let arr3 = arr2.getElementsByClassName("ep-status total")[0].innerHTML;

        //console.log(arr2.charAt(6));
        //console.log(arr3.charAt(6));

        console.log(animeList);
        //console.log(response.data);
        //console.log(typeof(response.data));
    })
    .catch(e => {
        console.log(e);
    });

/*
  next we need to make a get request using the links in animeList
  within each episode, we must grab the players and download the episode
  then, we extract the link and return it as a string
  the string is then provided to the discord bot and the discord bot sends it as an embed
*/
