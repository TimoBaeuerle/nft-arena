export function detectProvider() {
    let provider;
    if (window.ethereum) {
        provider = window.ethereum;
    } else if (window.web3) {
        provider = window.web3.currentProvider;
    } else {
        console.warn("No ethereum browser detected! Check out metamask!");
    }
    return provider;
}