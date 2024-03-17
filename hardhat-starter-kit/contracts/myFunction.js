const id = parseInt(args[0]);
const url = args[1];

const apiResponse = await Functions.makeHttpRequest({
    url: `https://onlybrands-api.onrender.com/verify_image?url=${url}`
});
if (apiResponse.error) {
  throw Error('Request failed');
}
const { data } = apiResponse;
return Functions.encodeUint256(parseInt(data.likes));