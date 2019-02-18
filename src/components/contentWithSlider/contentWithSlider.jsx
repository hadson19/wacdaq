import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import classNames from 'classnames';
import Draggable from 'react-draggable';

const cookies = new Cookies();

class contentWithSlider extends Component {	
	constructor(props) {
		super(props)
		
		this.content = React.createRef();
		this.sliderContent = React.createRef();
		this.resizeWindowHandler = this.resizeWindowHandler.bind(this);
		this.handleSliderDrag = this.handleSliderDrag.bind(this);
		this.handleSliderDragStop = this.handleSliderDragStop.bind(this);
		this.handleSliderContentDrag = this.handleSliderContentDrag.bind(this);
		this.handleSliderContentDragStop = this.handleSliderContentDragStop.bind(this);
		this.sliderClick = this.sliderClick.bind(this);
		this.sliderWheel = this.sliderWheel.bind(this);
		
		this.state = {
			contentHeight: 0,
			sliderContentHeight: 0,
			sliderButtonPosition: {
				x: 0, y: 0
			},
			sliderContentPosition: {
				x: 0, y: 0
			}
		}
	}

	reset() {
		this.setState(
			{sliderContentPosition: {x: 0, y: 0}, sliderButtonPosition: {x: 0, y: 0}}, 
			() => {
				cookies.set(this.props.name, this.calcPercentage('sliderPosition', 0), { path: '/' });
				this.resizeWindowHandler();
			}
		);
	}
	
	resizeWindowHandler() {		
		const contentHeight = (this.content.current ? this.content.current.clientHeight : null);
		const sliderContentHeight = (this.sliderContent.current ? this.sliderContent.current.clientHeight : null);
		
        let updatePosition = false;
        
        if (contentHeight != this.state.contentHeight)
        {
            this.setState({ contentHeight });
            
            updatePosition = true;
        }
        
        if (sliderContentHeight != this.state.sliderContentHeight)
        {
            this.setState({ sliderContentHeight });
            
            updatePosition = true;
        }
		
        if (updatePosition)
        {
            this.setSliderPositionFromCookie();
        }
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeWindowHandler);
	}
	
	componentDidMount() {		
		this.resizeWindowHandler();
		window.addEventListener('resize', this.resizeWindowHandler);
	}
    
	componentDidUpdate() {
			this.resizeWindowHandler();
	}
	
	sliderClick(e) {
		if (!this.content)
			return false;
		
		let contentHeight = false;
		
		if (this.state.contentHeight)
			contentHeight = this.state.contentHeight;
		else if (this.content.current)
			contentHeight = this.content.current.clientHeight;
			
		if (!contentHeight)
			return false;
		
		let offsetTop = 0;
		let element = this.content.current;
		
		do {
			if ( !isNaN( element.offsetTop ) ){
				offsetTop += element.offsetTop;
			}
		} while( element = element.offsetParent );
		
		let y = e.pageY - offsetTop - 22;
		
		if (y < 0)
			y = 0;
		
		if (y > contentHeight - 67)
			y = contentHeight - 67;
				
		this.setState({sliderButtonPosition: {x: 0, y}});
		this.setState({sliderContentPosition: {x: 0, y: this.calcPosition('sliderContent', this.calcPercentage('sliderPosition', y))}});
		
		cookies.set(this.props.name, this.calcPercentage('sliderPosition', y), { path: '/' });
	}
	
	sliderWheel(e) {
		if (!this.content)
			return false;
		
		let contentHeight = false;
		
		if (this.state.contentHeight)
			contentHeight = this.state.contentHeight;
		else if (this.content.current)
			contentHeight = this.content.current.clientHeight;
			
		if (!contentHeight)
			return false;
		
		let sliderContentHeight = false;
			 
		if (this.state.sliderContentHeight)
			sliderContentHeight = this.state.sliderContentHeight;
		else if (this.sliderContent.current)
			sliderContentHeight = this.sliderContent.current.clientHeight;
		
		if (!sliderContentHeight)
			return false;
		
		let {x, y} = this.state.sliderContentPosition;
		
		let scrollSpeed = 35;

		y -= e.deltaY ? (e.deltaY > 0 ? 1 : -1) * scrollSpeed : 0;
		
		if (y < (this.state.contentHeight - this.state.sliderContentHeight))
			y = (this.state.contentHeight - this.state.sliderContentHeight);
		
		if (y > 0)
			y = 0;	
			
		this.setState({sliderContentPosition: {x: 0, y}});
		this.setState({sliderButtonPosition: {x: 0, y: this.calcPosition('slider', this.calcPercentage('sliderContentPosition', y))}});
		
		cookies.set(this.props.name, this.calcPercentage('sliderContentPosition', y), { path: '/' });

		let blockHeight = this.sliderContent.current.clientHeight - this.content.current.clientHeight;
		let axisY = -blockHeight;

		if (y > axisY && y < 0) {
			e.preventDefault();
		}
	}
	
	handleSliderContentDragStart(e, ui) {
		if (e.type == 'mousedown')
			return false;	
	}
	
	handleSliderContentDrag(e, ui) {
		const {x, y} = ui;
    	this.setState({sliderContentPosition: {x, y}});
    	
    	this.setState({sliderButtonPosition: {x: 0, y: this.calcPosition('slider', this.calcPercentage('sliderContentPosition', y))}});
	}
	
	handleSliderContentDragStop(e, ui) {
		const {x, y} = ui;    	
    	cookies.set(this.props.name, this.calcPercentage('sliderContentPosition', y), { path: '/' });
	}
	
	handleSliderDragStart(e, ui) {
		if (e.type == 'touchstart')
			return;
	}
	
	handleSliderDrag(e, ui) {
		const {x, y} = ui;
    	this.setState({sliderButtonPosition: {x, y}});
    	
    	this.setState({sliderContentPosition: {x: 0, y: this.calcPosition('sliderContent', this.calcPercentage('sliderPosition', y))}});
	}
	
	handleSliderDragStop(e, ui) {
		const {x, y} = ui;    	
    	cookies.set(this.props.name, this.calcPercentage('sliderPosition', y), { path: '/' });
	}
	
	setSliderPositionFromCookie() {		
		let sliderPositionPercentage = parseFloat(cookies.get(this.props.name));
		
        if (isNaN(sliderPositionPercentage))
        {
            if (typeof(this.props.sliderStartPosition) != 'undefined')
            {
                if (this.props.sliderStartPosition == 'bottom')
                    sliderPositionPercentage = 1;
                else
                    sliderPositionPercentage = 0; 
            } else
                sliderPositionPercentage = 0;
        }
						
		let sliderPosition = this.calcPosition('slider', sliderPositionPercentage);
							
		this.setState({ sliderButtonPosition: {x: 0, y: sliderPosition} });
		
		let sliderContentPosition = this.calcPosition('sliderContent', sliderPositionPercentage);
		
		this.setState({ sliderContentPosition: {x: 0, y: sliderContentPosition} });
	}
	
	calcPosition(what, value) {
		
		let contentHeight = false;
		
		if (this.state.contentHeight)
			contentHeight = this.state.contentHeight;
		else if (this.content.current)
			contentHeight = this.content.current.clientHeight;
		
		if (!contentHeight)
			return 0;
				
		switch (what)
		{
			case 'slider':
							
				return parseInt((contentHeight - 67) * value, 10);
				
			break;
			
			case 'sliderContent':
			
				let sliderContentHeight = false;
			 
				if (this.state.sliderContentHeight)
					sliderContentHeight = this.state.sliderContentHeight;
				else if (this.sliderContent.current)
					sliderContentHeight = this.sliderContent.current.clientHeight;
				
				if (!sliderContentHeight)
					return 0;
				
				return -parseInt((sliderContentHeight - contentHeight) * value, 10);
				
			break;
		}
	}
	
	calcPercentage(by, value) {
		
		let contentHeight = false;
		
		if (this.state.contentHeight)
			contentHeight = this.state.contentHeight;
		else if (this.content.current)
			contentHeight = this.content.current.clientHeight;
		
		if (!contentHeight)
			return 0;
		
		switch (by)
		{
			case 'sliderPosition':
			
				 return (value / (contentHeight - 67));
			
			break;
			
			case 'sliderContentPosition':
			
				let sliderContentHeight = false;
			 
				if (this.state.sliderContentHeight)
					sliderContentHeight = this.state.sliderContentHeight;
				else if (this.sliderContent.current)
					sliderContentHeight = this.sliderContent.current.clientHeight;
				
				if (!sliderContentHeight)
					return 0;
				
				return (value / (contentHeight - sliderContentHeight));
				
			break;
		}
	}
	
	render() {        
        let blockClass = this.props.class;

        blockClass = classNames(blockClass);
        				
		return (
			<div onWheel={this.sliderWheel} className={blockClass}>
				{this.state.sliderContentHeight >= this.state.contentHeight &&
					<div onClick={this.sliderClick} className="slider">
						<Draggable
						bounds="parent"
						position={this.state.sliderButtonPosition}
				        axis="y"
				        onStart={this.handleSliderDragStart}
				        onDrag={this.handleSliderDrag}
				        onStop={this.handleSliderDragStop}>
							<div className="slider-button">
							</div>
						</Draggable>
					</div>
				}
				<div ref={this.content} className="sliderContent">
					<Draggable
					bounds={{top: (this.state.contentHeight - this.state.sliderContentHeight), left: 0, right: 0, bottom: 0}}
					position={this.state.sliderContentPosition}
			        axis="y"
			        onStart={this.handleSliderContentDragStart}
			        onDrag={this.handleSliderContentDrag}
			        onStop={this.handleSliderContentDragStop}>
						<div ref={this.sliderContent} className="sliderContent-content">
							{this.props.children}
						</div>
					</Draggable>
				</div>
			</div>
		);
	}
}

export default contentWithSlider;