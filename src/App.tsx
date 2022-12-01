import { useEffect, useRef, useState } from 'react'
import './App.css'

// Import Components
import { Slider } from './components/Slider'
import { ColourSelector } from './components/ColourSelector'
import { MenuIcon } from './components/MenuIcon'

// Declare Point type
type point = {
  x: number
  y: number
  color: string
}

function App() {

  // Declare points as an array of the point type
  var points: Array<point>  

  // Colour Options + Themes
  const defaultTheme = ['#558cf4']
  const purple = ['#440099','#ffffff','#ece6f5','#c7b3e0','	#8f66c2']
  const christmas =['#d4af37', '#aaa9ad', '#f3f6f4', '#cc0000', '	#274e13']
  const fire = ['#ffff00','	#ffcc00', '#ff9900', '#ff6600', '#ff3300']
  const bright = ['#8582f2', '#eff282', '#f282d9','#acf282','#f2b182']
  const neon = ['#ff1e76','	#4280ff','#31dab7','#0af9fe','#3202c5']
  const themes = [defaultTheme,neon, purple, fire, bright,christmas]

  const [colorScheme, setColorTheme] = useState(0)
  
  // Refrences to container elements
  const canvas = useRef<HTMLCanvasElement>()
  const screen = useRef<HTMLDivElement>() // Reference to screen container
  const [screenDimensions, setScreenDimensions] = useState({width: 150, height: 150}) // Screen dimensions

  // Spiral Options
  const [numPoints, setNumPoints] = useState(100);
  const [turnFraction, setTurnFraction] = useState(1);
  const [increaseRate, setIncreaseRate] = useState(3)
  const [power, setPower] = useState(1)
  const [spiralSize, setSpiralSize] = useState(300)
  const [pointSize, setPointSize] = useState(1)


  // Menu Support for mobile devices
  const [menuActive, setMenuActive] = useState(false)

  // Create Points
  function getPoints(){

    // Create Array with size equal to numPoints
    points = Array(numPoints).fill({}).map(( _ , i) => {

      // Calculate point distance and angle
      let dst = Math.pow(i / (numPoints - 1), power)
      let angle = (2 * Math.PI * turnFraction * i) * (Math.PI/180)

      // Calculate point position 
      let x = dst * Math.cos(angle) * spiralSize + (0.5 * screenDimensions.width)
      let y = dst * Math.sin(angle) * spiralSize + (0.5 * screenDimensions.height)
      
      // Default Colour
      var color = 'white'

      // Change point colour based off of colour theme
      var colours = themes[colorScheme]
      colours.forEach((x, index) => {
        if ( (i + index) % colours.length == 0){
          color = colours[index]
        }
      })
    
      // Return Point info
      return ({x: x, y: y, color: color})

    })

    return points

  }

  // Plot Points
  function plotPoints(points: point[]){

    // Get Canvas Element
    const canvaseElm = document.getElementById('boids') as HTMLCanvasElement;
    const ctx = canvaseElm?.getContext("2d");

    // Clear Canvas
    ctx.clearRect(0, 0,screenDimensions.width, screenDimensions.height);

    // Fore Each Point
    points.forEach((point: any) => {

      // Point Color
      ctx.strokeStyle = point.color;

      // Point Size
      ctx.lineWidth = pointSize;

      // Draw point
      ctx.strokeRect(point.x, point.y , 1, 1);

    })

  }

  // Render Canvas
  useEffect(() => {

    const points = getPoints();

    plotPoints(points);

  }, [screenDimensions, turnFraction, numPoints, colorScheme, power])
  
  // Set screen dimensions on first render
  useEffect(() => {

    setScreenDimensions({width: screen.current.offsetWidth, height: screen.current.offsetHeight})

    window.addEventListener('resize', () => {
      setScreenDimensions({width: screen.current.offsetWidth, height: screen.current.offsetHeight})
    })
    
  }, [])

  // Increase Turn Fraction every render
  useEffect(() => {

      setTurnFraction(turnFraction + (Math.pow(10, increaseRate) * 0.000001))

  }, [turnFraction])

  return (
    <>
    <div className="screen" ref = {screen}>
      <canvas ref = {canvas} width = {screenDimensions.width | 150} height = {screenDimensions.height | 150} id = 'boids'></canvas> 
      
      <div className="sliders" data-show = {menuActive}>

        <Slider value = {increaseRate} min = {1} max = {4} setState = {setIncreaseRate} title = {'Change Rate'} step = {1}></Slider>
        <Slider value = {numPoints} min = {1} max = {10000} setState = {setNumPoints} title = {'Num Points'} step = {1}></Slider>

        <ColourSelector colorScheme={colorScheme} setColorTheme = {setColorTheme} themes = {themes}></ColourSelector>
          
        <Slider value = {Math.round(power * 100) / 100} min = {-1} max = {1} setState = {setPower} title = {'Power'} step = {0.1}></Slider>
        <Slider value = {spiralSize} min = {10} max = {500} setState = {setSpiralSize} title = {'Spiral Size'} step = {1}></Slider>

      </div>

      <MenuIcon menuActive = {menuActive} setMenuActive = {setMenuActive}></MenuIcon>

    </div>
    </>
  )
}

export default App


