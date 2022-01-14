

// Animates a target element with an animation CSS class
function animate(target, animation){
    if(target){
        target.current.classList.remove(animation);
        setTimeout(()=>{target.current.classList.add(animation);}, 1);
    }
}

// Animates a target element with an animation CSS class
// Navigates away to a route once the animation is complete
function animatedNavigate(nav, route, target, anim){
    if(anim){
        animate(target, anim.name);
        setTimeout(()=>{nav(route, { replace: true })}, anim.time);
    } 
    else {
        nav(route, { replace: true });
    }
}

export {animate, animatedNavigate}
