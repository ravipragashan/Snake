'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"

// Types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = [number, number]

// Constants
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE: Position[] = [[5, 5]]
const INITIAL_DIRECTION: Direction = 'RIGHT'
const INITIAL_FOOD: Position = [10, 10]
const GAME_SPEED = 150

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    const newSnake = [...snake]
    const [y, x] = newSnake[0]

    switch (direction) {
      case 'UP':
        newSnake.unshift([y - 1, x])
        break
      case 'DOWN':
        newSnake.unshift([y + 1, x])
        break
      case 'LEFT':
        newSnake.unshift([y, x - 1])
        break
      case 'RIGHT':
        newSnake.unshift([y, x + 1])
        break
    }

    // Check if snake ate food
    if (newSnake[0][0] === food[0] && newSnake[0][1] === food[1]) {
      setScore(prevScore => prevScore + 1)
      generateFood()
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)

    // Check for collisions
    if (checkCollision(newSnake)) {
      setGameOver(true)
    }
  }, [snake, direction, food])

  const checkCollision = (newSnake: Position[]): boolean => {
    const [head, ...body] = newSnake
    const [y, x] = head

    // Check wall collision
    if (y < 0 || y >= GRID_SIZE || x < 0 || x >= GRID_SIZE) {
      return true
    }

    // Check self collision
    return body.some(([by, bx]) => by === y && bx === x)
  }

  const generateFood = () => {
    let newFood: Position
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ]
    } while (snake.some(([y, x]) => y === newFood[0] && x === newFood[1]))
    setFood(newFood)
  }

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection('UP')
        break
      case 'ArrowDown':
        setDirection('DOWN')
        break
      case 'ArrowLeft':
        setDirection('LEFT')
        break
      case 'ArrowRight':
        setDirection('RIGHT')
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(moveSnake, GAME_SPEED)
      return () => clearInterval(gameLoop)
    }
  }, [gameOver, moveSnake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(INITIAL_FOOD)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="mb-4">Score: {score}</div>
      <div
        className="grid bg-white border border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const y = Math.floor(index / GRID_SIZE)
          const x = index % GRID_SIZE
          const isSnake = snake.some(([sy, sx]) => sy === y && sx === x)
          const isFood = food[0] === y && food[1] === x

          return (
            <div
              key={index}
              className={`
                ${isSnake ? 'bg-green-500' : ''}
                ${isFood ? 'bg-red-500' : ''}
              `}
            />
          )
        })}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold mb-2">Game Over!</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
    </div>
  )
}

