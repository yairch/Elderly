function Identify(props){
    
    const moveToElderlyPage = () => {
		props.history.push('/login');
    }
    
    return (
        <div dir='ltr'>
            <h1 style={{position: 'relative',textAlign: 'center', color:'blue', top:'20px'}} >Welcome!</h1><br />
            <button style={{position: 'absolute', left:'30%', borderRadius: 10, top:'100px'}} className="elderly" onClick={moveToElderlyPage}>I am an elderly user</button>
            <button style={{position: 'absolute', right:'30%', borderRadius: 10, top:'100px'}} className="notEledrly" onClick={() => {props.history.push('/loginElse')}}>I am not an elderly user</button>
        </div>
    
    );
}

export default Identify;