import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Camera } from 'lucide-react';
import { useContext, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import { ActiveCallsType } from '../routes/community/community';
import { SocketContext } from '@/context/SocketContext';
import VideoPlayer from './VideoPlayer';

const VideoChat = ({activeCalls}: {activeCalls: ActiveCallsType[]}) => {
    const [inCall, setInCall] = useState(false);
    const { callUser, leaveCall } = useContext(SocketContext)!;
  
    const handleJoinCall = (id: string) => {
      setInCall(true);
      callUser(id);
    };
  
    const handleExitCall = () => {
      setInCall(false);
      leaveCall();
    };

    return (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Video Channel</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-4rem)]">
            {inCall ? (
              <div className="flex flex-col items-center justify-center h-full">
                {/* Replace this with your video/audio call UI */}
                <p className="text-lg font-medium">You are in a call</p>
                <VideoPlayer />
                <div className="mt-4">
                  <Button size="sm" onClick={handleExitCall}>Leave Call</Button>
                </div>
              </div>

            ) : (
              <ul className="space-y-4 p-4">
                {activeCalls.map((call) => (
                  <li key={call.artistId} className="flex items-center justify-between space-x-4 p-2 rounded-md hover:bg-accent">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={call.artistAvatarUrl} alt={call.artistId} />
                        <AvatarFallback>{call.artistName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{call.artistName}</p>
                        <p className="text-sm text-muted-foreground">In call</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <Button 
                        size="sm" 
                        onClick={() => handleJoinCall(call.artistId)}
                        >Join</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </Card>
      );
    };


export default VideoChat