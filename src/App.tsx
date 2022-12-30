import React, {useEffect} from 'react'
import './css/styles.css'

import {Card} from './components/Card/Card'
import {Search} from './components/Search/Search'
import {MainContainer} from './components/Containers/MainContainer'
import {CardsContainer} from './components/Containers/CardsContainer'
import {nftType} from './types/types'

function App() {
  // States list
  const [nfts, setNfts] = React.useState<Omit<nftType[],"fetchedAt"|"createdAt"> | undefined>([])
  const [nftsApi, setNftsapi] = React.useState<Omit<nftType[],"fetchedAt"|"createdAt"> | undefined>([])
  const [elements, setElements] = React.useState<number>()
  const [error, setError] = React.useState<Array<{ message: string }> | undefined>([])

  //Handle Input change function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const filteredList = nftsApi?.filter(nft => {
      return (
          nft.title.toLowerCase()?.includes(value.toLowerCase()) ||
          nft.description.toLowerCase().includes(value.toLowerCase()) ||
          nft.creator.toLowerCase().includes(value.toLowerCase())
      )
    })
    setNfts(filteredList)
  }
  //Define api response type
  type JSONResponse = {
    data?: Array<Omit<nftType,"createdAt"|"fetchedAt">>;
    elements?: number;
    errors?: Array<{ message: string }>;
  };

  // Use useEffect hook to perform API call
  useEffect(() => {
    const api = async () => {
      const jsonData = await fetch("https://636b20b6c07d8f936dae7fe4.mockapi.io/api/nft/all", {
        method: "GET"
      });
      const {data, errors, elements}: JSONResponse = await jsonData.json();
      //Update states
      if (jsonData.ok) {
        setNfts(data)
        setNftsapi(data)
        setElements(elements)
        setError(errors)
      }else{
        setError([{message:`Error Api : code ${jsonData.status}`}])
        setNfts([])
        setNftsapi([])
        setElements(0)
      }
    }
    api();

  }, []);
  return (
      <MainContainer>
        {/*Display search input and passing handling changes function*/}
        <Search onChange={handleChange}/>
        <div role={"alert"} className="elements">
          {/*count elements*/}
          {elements ? `Il y a ${elements} elements.` : null}
          {/*Display errors*/}
          <span
              style={{color: "red"}}>{error?.length ? `Error : ${error?.map(err => `${err.message}, `)}` : null}</span>
        </div>
        {/*Display nft's*/}
        <CardsContainer>
          {nfts?.map((nft, idx) => (
              <Card key={idx} nft={nft}/>
          ))}
        </CardsContainer>
      </MainContainer>
  )
}

export {App}
