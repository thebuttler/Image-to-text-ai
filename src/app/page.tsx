import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowRight } from "lucide-react"
import FileUpload from '@/components/FileUpload';


export default async function Home() {
  const { userId }: { userId: string | null } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Get your Image Description Here!</h1>
              <UserButton afterSignOutUrl="/" />
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Use the power of AI to analize and read your images. 
          </p>

          <div className='w-full mt-4'>
            {isAuth ? (
                < FileUpload />
            ): (
              <Link href="/sign-in">
                <Button> Login to get started
                  <LogIn className="w-4 h-4 ml-2"/>
                </Button>
              </Link>)}
          </div>
        </div>  
      </div>
    </div>
  );
}
