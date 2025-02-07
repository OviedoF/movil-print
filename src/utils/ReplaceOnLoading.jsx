'use client'
import React from 'react'
import { BarLoader } from 'react-spinners'

export default function ReplaceOnLoading({ children, style, loading }) {
  return (
    <>
      {loading && <div className="loading" style={style || {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <BarLoader size={16} color='#fefefe' />
      </div>}

      {!loading && children}
    </>
  )
}
