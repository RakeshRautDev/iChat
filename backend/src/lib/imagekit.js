import ImageKit,{toFile} from "@imagekit/nodejs"

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL
});

export function hasImageKitConfig(){
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}


export function createFileName(originalName="upload"){
    const safeName=originalName.replace(/[^a-zA-Z0-9._-]/g,"_");
    return `chat-${Date.now()}-${safeName}`;
}


export async function uploadChatMedia(file){
    const fileName=createFileName(file.originalName);

    const result=await imagekit.files.upload({
        file:await toFile(file.buffer, fileName,{type:file.mimetype}),
        fileName,
        folder:"/chat"
    })
    return result.url;
}

