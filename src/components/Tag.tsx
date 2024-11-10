
type TagType = {
    index: string;
    name: string;
    added: boolean;
    custom: boolean;
    addTagHandler: (tagName: string) => void; 
    removeTagHandler: (tagName: string) => void; 
};

const Tag = ({index, name, added, custom, addTagHandler, removeTagHandler}: TagType) => {
  return (
    <span 
        key={index} 
        className="bg-muted text-muted-foreground text-sm py-1 px-2 rounded-full text-center"
    >
        {name}

  </span>
  )
}

export default Tag