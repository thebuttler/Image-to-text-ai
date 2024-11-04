'use client'
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; 

const FileUpload = () => {
    const router = useRouter();
    const [ uploading, setUploading ] = React.useState(false);

    // Fix Error "No QueryClient set, use QueryClientProvider to set one"
    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            file_key,
            file_name,
        }: {
            file_key: string;
            file_name: string;
        }) => {
            const response = await axios.post("/api/chat-create", {
                file_key,
                file_name,
              });
            return response.data;
        },
    });

    const {getRootProps, getInputProps} = useDropzone({
        accept: {'application/image': [".png", ".jpg", ".jpeg"]},
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                //When the image is larger than 10MB
                toast.error("File image size is to big!, please pick an image smaller than 10MB")
                return;
            }
            try {
                setUploading(true);
                const data = await uploadToS3(file);
                console.log("Pinecone data", data);
                if (!data?.file_key || !data.file_name) {
                    toast.error("Someting went wrong uploading the image");
                    return;
                }
                mutate(data, {
                    onSuccess: ({ chat_id }) => {
                        toast.success("Chat created successfully");
                        //Here its possible to not create a chat but return a simple reponse
                        // from the API with the text description of the image
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: (err) => {
                        toast.error("Error creating chat");
                        console.log(err);
                    },
                });
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        },
    });
    return <div className='p-2 bg-white rouded-x1'>
        <div {...getRootProps({
            className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}>
            <input {...getInputProps()} />
            {uploading || isPending ? (
                <>
                    {/* loading state */}
                    <Loader2 className='w-10 h-10 text-blue-500' />
                    <p className='mt-2 text-sm text-slate-400'>
                        Spilling the tea to GPT...
                    </p>
                </>
            ) : (
                <>
                    <Inbox className='w-10 h-10 text-blue-500' />
                    <p className='mt-2 text-sm text-slate-400'>Drop Image Here</p>
                </>
            )}

        </div>
    </div>


};

export default FileUpload