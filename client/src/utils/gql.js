export const gql = async (ask, path) => {
    let query = ask;
    let method = "POST";
    let headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    let body = JSON.stringify({ query });

    // Catch for non root GQL calls
    const graphqlPath = path ? "../graphql" : "./graphql";

    try {
        let r = await fetch(graphqlPath, { method, headers, body });
        r = await r.json();
        return r.data;
    } catch (e) {
        console.error(e);
    }
}