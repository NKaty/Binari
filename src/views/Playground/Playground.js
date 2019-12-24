import React, { useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AceEditor from "react-ace";
import Sketch from 'react-p5'
import styles from "assets/jss/material-kit-react/views/playground.js";
import Node from './tree'
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/theme-twilight";
import {js} from 'js-beautify'

const beautify = js
const useStyles = makeStyles(styles);

export default function Playground(props) {
  const [currentCode, setCode] = useState(""+Node);
  const displayCode = beautify(currentCode)

  const classes = useStyles();
  const elementScale = window.devicePixelRatio < 2 ? 2 : window.devicePixelRatio
  const windowSize = elementScale * 500
  const gval = eval

  let unsavedCode = displayCode
  let treeNode = gval(`(${currentCode})`)

  let tree = new treeNode(50)
      tree.x = windowSize / 2
      tree.y = (20 * elementScale)
  let drawQ = [tree]
  let layerQ = []
  let layer = 1

  function setup(p5, canvasParentRef) {
    p5.textSize((12 * elementScale))
    p5.createCanvas(windowSize, windowSize).parent(canvasParentRef)
    p5.frameRate(200)
    
    for (var i = 0; i < 25; i++) {
      tree.insert(Math.floor(Math.random() * 100));
    }
  }

  function draw(p5){
    drawQ.forEach((el,i)=>{
        let distanceX = ((windowSize / 2.4) / p5.pow(2, layer)) + 12
        let distanceY = (20 * elementScale) + (layer * 9)

        p5.strokeWeight(elementScale + 1)
        p5.stroke(0)

        if(el.left){
            el.left.x = el.x - distanceX
            el.left.y = el.y + distanceY
            p5.line(el.x, el.y, el.left.x, el.left.y);
            layerQ.push(el.left)
        }

        if(el.right){
            el.right.x = el.x + distanceX
            el.right.y = el.y + distanceY
            p5.line(el.x, el.y, el.right.x, el.right.y);
            layerQ.push(el.right)
        }

        p5.textAlign(p5.CENTER);
        p5.stroke(0)
        p5.strokeWeight(1)
        p5.fill(p5.map(el.value,100,0,0,255),220,250);
        p5.ellipse(el.x, el.y, (17 * elementScale))
        p5.noStroke()
        p5.fill('black')
        p5.text(el.value, el.x, el.y + (6 + elementScale));

        if(!drawQ[i+1]){
            layer++
            drawQ = [...layerQ]
            layerQ = []
        }
    })
  }

  return (
    <>
      <div className={classes.margin}>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <GridContainer>
                <GridItem xs={12} sm={5} md={5}>
                  <AceEditor
                    mode="javascript"
                    theme="twilight"
                    name="code"
                    width="100%"
                    height="1000px"
                    value={displayCode}
                    onChange={(val)=> unsavedCode = val}
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                    editorProps={{ $blockScrolling: false }}
                  />
                </GridItem>
                <GridItem xs={12} sm={7} md={7}>
                  <h1>Binary Trees</h1><button onClick={()=>setCode(unsavedCode)}></button>
                  <h2>Introduction</h2>
                  <Sketch setup={setup} draw={draw} />
                </GridItem>
            </GridContainer>
            </div>
        </div>
      </div>
    </>
  );
}
