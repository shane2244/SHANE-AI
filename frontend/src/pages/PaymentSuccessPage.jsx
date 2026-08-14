import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

const API=`${process.env.REACT_APP_BACKEND_URL}/api`;
export default function PaymentSuccessPage(){const[params]=useSearchParams();const[status,setStatus]=useState("checking");const{refreshUser}=useAuth();useEffect(()=>{const id=params.get("session_id");let timer;const check=async()=>{const response=await fetch(`${API}/payments/status/${id}`);const data=await response.json();if(data.payment_status==="paid"){setStatus("paid");await refreshUser()}else timer=setTimeout(check,2000)};if(id)check();return()=>clearTimeout(timer)},[params,refreshUser]);return <div className="page payment-result" data-testid="payment-success-status">{status==="paid"?<CircleCheck/>:<LoaderCircle className="spin"/>}<p className="kicker">{status==="paid"?"Membership active":"Confirming membership"}</p><h1>{status==="paid"?"Your full path is open.":"One quiet moment…"}</h1>{status==="paid"&&<Link to="/app/discovery" data-testid="continue-to-discovery-link">Continue to Discovery</Link>}</div>}