import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';

const PostCard = ({ $id, title, featuredImage }) => {
    console.log(appwriteService.getFileView(featuredImage));

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4'>
                {featuredImage ? (
                    <img
                        src={appwriteService.getFileView(featuredImage)}
                        alt={title || "Post"}
                        className="rounded-lg"
                    />
                ) : (
                    <div className="bg-gray-200 h-40 w-full rounded-lg flex items-center justify-center text-gray-500">
                        No image
                    </div>
                )}

                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </Link>
    );
};

export default PostCard;
