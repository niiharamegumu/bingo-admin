import { Button, Flex, Grid } from '@chakra-ui/react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useCardList } from './hooks/useCardList'
import db from './libs/firebase'

const App = () => {
  const cardList = useCardList(1, 75)
  const [alreadyList, setAlreadyList] = useState<number[]>([])

  useEffect(() => {
    const init = async () => {
      const alreadyListRef = doc(db, 'lists', 'alreadyList')
      const alreadyListDoc = await getDoc(alreadyListRef)
      const numbers = alreadyListDoc.exists()
        ? alreadyListDoc.data().numbers
        : []
      setAlreadyList(numbers)
    }
    init()
  }, [])

  const toggleAction = (num: number, isActive: boolean) => {
    if (isActive) return removeNumber(num)
    addNumber(num)
  }

  const addNumber = async (num: number) => {
    const alreadyListRef = doc(db, 'lists', 'alreadyList')
    const alreadyListDoc = await getDoc(alreadyListRef)

    const numbers = alreadyListDoc.exists() ? alreadyListDoc.data().numbers : []
    await setDoc(doc(db, 'lists', 'alreadyList'), {
      numbers: [...numbers, num],
    })
    setAlreadyList([...numbers, num])
  }

  const removeNumber = async (num: number) => {
    const alreadyListRef = doc(db, 'lists', 'alreadyList')
    const alreadyListDoc = await getDoc(alreadyListRef)

    const numbers: number[] = alreadyListDoc.exists()
      ? alreadyListDoc.data().numbers
      : []
    const removedNumbers = numbers.filter((item) => item !== num)
    await setDoc(doc(db, 'lists', 'alreadyList'), {
      numbers: removedNumbers,
    })
    setAlreadyList(removedNumbers)
  }

  const resetNumbers = async () => {
    await setDoc(doc(db, 'lists', 'alreadyList'), {
      numbers: [],
    })
    setAlreadyList([])
  }

  return (
    <Grid
      templateColumns="repeat(5, 1fr)"
      maxW="90vw"
      margin="auto"
      rowGap={2}
      py={4}
    >
      {cardList.map((num) => (
        <Flex key={num} justify="center">
          <Button
            backgroundColor={alreadyList.includes(num) ? 'sTNotice' : ''}
            borderRadius="50%"
            border="1px solid"
            borderColor={alreadyList.includes(num) ? 'sTNotice' : 'sTMainColor'}
            color={alreadyList.includes(num) ? 'white' : 'sTMainColor'}
            w="15vw"
            h="15vw"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="5vw"
            type="button"
            onClick={() => toggleAction(num, alreadyList.includes(num))}
          >
            {num}
          </Button>
        </Flex>
      ))}
      <Button
        textAlign="center"
        gridColumn="1/6"
        backgroundColor="sTNotice"
        color="white"
        py={3}
        mt={4}
        type="button"
        onClick={resetNumbers}
      >
        リセット
      </Button>
    </Grid>
  )
}

export default App
