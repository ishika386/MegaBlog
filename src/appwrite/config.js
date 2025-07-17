import { Client, Databases, Storage, Query, ID, Permission, Role } from "appwrite";

import conf from "../conf/conf";



export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // e.g., https://cloud.appwrite.io/v1
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // ✅ Create a new post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(), // ✅ document ID
            {
                title,
                content,
                featuredImage,
                slug,
                status,
                userId,
            }
        );
    } catch (error) {
        console.log("Appwrite service :: createPost :: error", error.message, error);
        return false;
    }
}


    // ✅ Update post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            return false;
        }
    }

    // ✅ Delete post
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // ✅ Get a single post
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // ✅ Get all posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // ✅ File Upload
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [Permission.read(Role.any())]  // 👈 this line is critical
                
            );
        } 
        catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
        

    }

    // ✅ Delete File
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // ✅ Get file preview
    getFileView(fileId) {
        return this.bucket.getFileView(conf.appwriteBucketId, fileId);
    }
}

const appwriteService = new Service();
export default appwriteService;
