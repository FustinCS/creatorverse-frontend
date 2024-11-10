import { useState } from "react";
import { Plus, X } from "lucide-react";

type TagType = {
    name: string;
    added: boolean;
    custom: boolean;
    addTagHandler: (tagName: string) => void;
    removeTagHandler: (tagName: string) => void;
};

const Tag = ({
    name,
    added,
    custom,
    addTagHandler,
    removeTagHandler,
}: TagType) => {
    const [editName, setEditName] = useState(name);

    const handleButton = () => {
        if (!added) {
            if(editName === ''){
                return;
            }
            addTagHandler(editName);
            if(custom){
                setEditName('');
            }
        } else {
            removeTagHandler(name);
        }
    };

    return (
        <span
            className="bg-slate-300 text-muted-foreground text-sm py-1 px-2 rounded-full text-center flex flex-row justify-between"
        >
            {custom ? (
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value.replace(/\s/g, ''))}
                    className=" font-bold text-center border-none outline-none bg-transparent text-black"
                    placeholder="tag: "
                />
            ) : (
                <p className="text-black font-bold text-center m-auto border-none outline-none bg-transparent">{name}</p>
            )}
            <button 
                onClick={handleButton}
                aria-label={!added ? "Add tag" : "Remove tag"}
                // className="ml-2"
            >
            {!added ? <Plus /> : <X />}
            </button>
        </span>
    );
};

export default Tag;
