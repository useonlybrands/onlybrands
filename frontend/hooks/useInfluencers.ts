interface Influencer {
    "email": string,
    "wallet": string,
    "platform": string,
    "industries": string,
    "follower_count": number,
    // "language": string,
    "sex": string,
    "age": number,
    "rating": number,
    "image": string
}

export const useInfluencers: () => Influencer[] = () => {
    return [{"username":"areye0","wallet":"0x7964fc622a54e79a2d2404fa455d5ac200fdab61","platform":"Gembucket","email":"wcayton0@t.co","sex":"Male","industries":"Meat/Poultry/Fish","follower_count":11618,"age":78,"rating":5.0,"image":"https://picsum.photos/300/300"},
        {"username":"vgrimsey1","wallet":"0x0db3f3730b7a1c9d51a2944328d36440c53156ee","platform":"Transcof","email":"sstewart1@networkadvertising.org","sex":"Female","industries":"Newspapers/Magazines","follower_count":13385,"age":57,"rating":3.6,"image":"https://picsum.photos/300/300"},
        {"username":"ubonome2","wallet":"0x1465a696c25c919c1dd6ff19de5b7546765c7c25","platform":"Bitwolf","email":"gtibb2@upenn.edu","sex":"Female","industries":"n/a","follower_count":6946,"age":31,"rating":2.8,"image":"https://picsum.photos/300/300"},
        {"username":"slints3","wallet":"0x7aa51b31ef0eadb93ec4598252006a66ee66d45e","platform":"Cookley","email":"lmcgilroy3@ycombinator.com","sex":"Male","industries":"Farming/Seeds/Milling","follower_count":11536,"age":29,"rating":2.4,"image":"https://picsum.photos/300/300"},
        {"username":"ndayly4","wallet":"0xc92601318e2b00e0639da20876149539a2138d8e","platform":"Stim","email":"jbrownstein4@twitter.com","sex":"Female","industries":"Real Estate Investment Trusts","follower_count":10301,"age":76,"rating":0.6,"image":"https://picsum.photos/300/300"}]
}