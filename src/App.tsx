import { useEffect, useRef, useState } from 'react'
import './App.css'
import {Slider} from './Slider'


function App() {

  
  const canvas = useRef<HTMLCanvasElement>()
  const screen = useRef<HTMLDivElement>() // Reference to screen container
  const [screenDimensions, setScreenDimensions] = useState({width: 150, height: 150}) // Screen dimensions

  const [numPoints, setNumPoints] = useState(10);
  const [turnFraction, setTurnFraction] = useState((1 + Math.sqrt(5)) / 2);
  const [increaseRate, setIncreaseRate] = useState(1)

  function plotPoints(points: any){

    const canvaseElm = document.getElementById('boids') as HTMLCanvasElement;
    const ctx = canvaseElm?.getContext("2d");

    ctx.clearRect(0, 0,screenDimensions.width, screenDimensions.height);

    points.forEach((point: any) => {

      // Draw Point
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(point.x, point.y , 1, 1);

    })

  }

  function getPoints(){

    const points = Array(numPoints).fill({x: 0, y: 2}).map((point, i) => {
      let dst = i/ (numPoints - 1)
      let angle = (2 * Math.PI * turnFraction * i) * (Math.PI/180)

      let x = dst * Math.cos(angle) * 300 + (0.5 * screenDimensions.width)
      let y = dst * Math.sin(angle) * 300 + (0.5 * screenDimensions.height)

      return ({x: x, y: y})
    })

    return points
  }

  useEffect(() => {
    // const points = [{x: 10, y: 15}]

    const points = getPoints();

    plotPoints(points);

  }, [screenDimensions, turnFraction, numPoints])
  

  useEffect(() => {

    setScreenDimensions({width: screen.current.offsetWidth, height: screen.current.offsetHeight})

  }, [])

  useEffect(() => {

      setNumPoints(numPoints + increaseRate)

  }, [numPoints])
  return (
    <>
    <div className="screen" ref = {screen}>
      <canvas ref = {canvas} width = {screenDimensions.width | 150} height = {screenDimensions.height | 150} id = 'boids'></canvas> 
      
      <div className="sliders">
        <Slider value = {increaseRate} min = {1} max = {10} setState = {setIncreaseRate} title = {'Increase Rate'}></Slider>
        <Slider value = {turnFraction} min = {0} max = {100} setState = {setTurnFraction} title = {'Turn Fraction'}></Slider>
      </div>

    </div>
    </>
  )
}

export default App


