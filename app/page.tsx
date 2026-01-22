"use client"

import { ethers } from "ethers"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, Lock, Repeat, Users, Wallet, Globe, Zap,
  ChevronDown, X, Loader2, ExternalLink, Copy, RefreshCw,
  ArrowDownToLine, ArrowUpFromLine, AlertCircle, Check, Info, Clock, Timer
} from "lucide-react"

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  EN: {
    connect: "Connect Wallet",
    vault: "The Vault",
    yield: "Yield Lock",
    stream: "The Stream",
    guardian: "The Guardian",
    deposit: "Deposit",
    withdraw: "Withdraw",
    confirm: "Confirm",
    cancel: "Cancel",
    yourBalance: "Your Balance",
    deposited: "Deposited",
    apy: "APY",
    yieldEarned: "Yield Earned",
    tvl: "Total Value Locked",
    activeStreams: "Active Streams",
    totalStreaming: "Total Streaming",
    released: "Released",
    nextRelease: "Next Release",
    recoveryAddress: "Recovery Address",
    inactivityTimer: "Inactivity Timer",
    gasEstimate: "Gas Estimate",
    installWallet: "Install MetaMask or OneKey",
    connected: "Wallet Connected!",
    disconnected: "Wallet Disconnected",
    txComplete: "Transaction Complete!",
    notConfigured: "Guardian Not Configured",
    noProtection: "Your assets have no recovery protection",
    lockAssets: "Lock Assets",
    createStream: "Create Stream",
    activateGuardian: "Activate Guardian",
    amount: "Amount",
    duration: "Duration",
    frequency: "Frequency",
    recipient: "Recipient (optional)",
    weekly: "Weekly",
    monthly: "Monthly",
    days: "Days",
    month: "Month",
    months: "Months",
    year: "Year",
    yourPortfolio: "Your Portfolio",
    walletBalance: "Wallet Balance",
    vaultStatus: "Vault Status",
    activeDeposit: "Active Deposit",
    yieldLockStatus: "Yield Lock Status",
    lockedBalance: "Locked Balance",
    accumulatedProfit: "Accumulated Profit",
    unlockDate: "Unlock Date",
    guardianStatus: "Guardian Status",
    heritageAddress: "Heritage Address",
    protectionActive: "Protection Active",
    streamStatusLabel: "Stream Status",
    active: "Active",
    inactive: "Inactive",
    progress: "Progress",
    remaining: "Remaining",
    noActiveStreams: "No active streams",
    syncData: "Sync Data",
    syncing: "Syncing...",
    dataSynced: "Data synchronized!",
    disconnect: "Disconnect",
    connectedWallet: "Connected Wallet",
    addressCopied: "Address copied!",
    view: "View",
    manageLocks: "Manage Locks",
    configureGuardian: "Configure Guardian",
    noActiveLock: "No Active Lock",
    noDeposit: "No Deposit",
    notConnected: "---"
  },
  PT: {
    connect: "Conectar Carteira",
    vault: "O Cofre",
    yield: "Yield Lock",
    stream: "O Fluxo",
    guardian: "O Guardião",
    deposit: "Depositar",
    withdraw: "Sacar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    yourBalance: "Seu Saldo",
    deposited: "Depositado",
    apy: "APY",
    yieldEarned: "Rendimento",
    tvl: "Valor Total Bloqueado",
    activeStreams: "Fluxos Ativos",
    totalStreaming: "Total em Fluxo",
    released: "Liberado",
    nextRelease: "Próxima Liberação",
    recoveryAddress: "Endereço de Recuperação",
    inactivityTimer: "Timer de Inatividade",
    gasEstimate: "Estimativa de Gás",
    installWallet: "Instale MetaMask ou OneKey",
    connected: "Carteira Conectada!",
    disconnected: "Carteira Desconectada",
    txComplete: "Transação Completa!",
    notConfigured: "Guardião Não Configurado",
    noProtection: "Seus ativos não tem proteção de recuperação",
    lockAssets: "Bloquear Ativos",
    createStream: "Criar Fluxo",
    activateGuardian: "Ativar Guardião",
    amount: "Quantia",
    duration: "Duração",
    frequency: "Frequência",
    recipient: "Destinatário (opcional)",
    weekly: "Semanal",
    monthly: "Mensal",
    days: "Dias",
    month: "Mês",
    months: "Meses",
    year: "Ano",
    yourPortfolio: "Seu Portfólio",
    walletBalance: "Saldo na Carteira",
    vaultStatus: "Status do Cofre",
    activeDeposit: "Depósito Ativo",
    yieldLockStatus: "Status do Yield Lock",
    lockedBalance: "Saldo Bloqueado",
    accumulatedProfit: "Lucro Acumulado",
    unlockDate: "Data de Desbloqueio",
    guardianStatus: "Status do Guardião",
    heritageAddress: "Endereço de Herança",
    protectionActive: "Proteção Ativa",
    streamStatusLabel: "Status do Fluxo",
    active: "Ativo",
    inactive: "Inativo",
    progress: "Progresso",
    remaining: "Restante",
    noActiveStreams: "Nenhum fluxo ativo",
    syncData: "Sincronizar Dados",
    syncing: "Sincronizando...",
    dataSynced: "Dados sincronizados!",
    disconnect: "Desconectar",
    connectedWallet: "Carteira Conectada",
    addressCopied: "Endereço copiado!",
    view: "Ver",
    manageLocks: "Gerenciar Bloqueios",
    configureGuardian: "Configurar Guardião",
    noActiveLock: "Nenhum Bloqueio Ativo",
    noDeposit: "Nenhum Depósito",
    notConnected: "---"
  },
  ES: { connect: "Conectar Billetera", vault: "La Boveda", yield: "Yield Lock", stream: "El Flujo", guardian: "El Guardian", deposit: "Depositar", withdraw: "Retirar", confirm: "Confirmar", cancel: "Cancelar", yourBalance: "Tu Saldo", deposited: "Depositado", apy: "APY", yieldEarned: "Rendimiento", tvl: "Valor Total Bloqueado", activeStreams: "Flujos Activos", totalStreaming: "Total en Flujo", released: "Liberado", nextRelease: "Proxima Liberacion", recoveryAddress: "Direccion de Recuperacion", inactivityTimer: "Timer de Inactividad", gasEstimate: "Estimacion de Gas", installWallet: "Instala MetaMask o OneKey", connected: "Billetera Conectada!", disconnected: "Billetera Desconectada", txComplete: "Transaccion Completa!", notConfigured: "Guardian No Configurado", noProtection: "Tus activos no tienen proteccion de recuperacion", lockAssets: "Bloquear Activos", createStream: "Crear Flujo", activateGuardian: "Activar Guardian", amount: "Cantidad", duration: "Duracion", frequency: "Frequencia", recipient: "Destinatario (opcional)", weekly: "Semanal", monthly: "Mensual", days: "Dias", month: "Mes", months: "Meses", year: "Ano", yourPortfolio: "Tu Portafolio", walletBalance: "Saldo en Billetera", vaultStatus: "Estado de la Boveda", activeDeposit: "Deposito Ativo", yieldLockStatus: "Estado del Yield Lock", lockedBalance: "Saldo Bloqueado", accumulatedProfit: "Ganancia Acumulada", unlockDate: "Fecha de Desbloqueo", guardianStatus: "Estado del Guardian", heritageAddress: "Direccion de Herencia", protectionActive: "Proteccion Activa", streamStatusLabel: "Estado del Flujo", active: "Activo", inactive: "Inactivo", progress: "Progreso", remaining: "Restante", noActiveStreams: "Sin flujos activos", syncData: "Sincronizar Datos", syncing: "Sincronizando...", dataSynced: "Datos sincronizados!", disconnect: "Desconectar", connectedWallet: "Billetera Conectada", addressCopied: "Direccion copiada!", view: "Ver", manageLocks: "Gestionar Bloqueos", configure Guardian: "Configurar Guardian", noActiveLock: "Sin Bloqueo Activo", noDeposit: "Sin Deposito", notConnected: "---" },
  FR: { connect: "Connecter Portefeuille", vault: "Le Coffre", yield: "Yield Lock", stream: "Le Flux", guardian: "Le Gardien", deposit: "Deposer", withdraw: "Retirer", confirm: "Confirmer", cancel: "Annuler", yourBalance: "Votre Solde", deposited: "Depose", apy: "APY", yieldEarned: "Rendement", tvl: "Valeur Totale Verrouillee", activeStreams: "Flux Actifs", totalStreaming: "Total en Flux", released: "Libere", nextRelease: "Prochaine Liberation", recoveryAddress: "Adresse de Recuperation", inactivityTimer: "Timer d'Inactivite", gasEstimate: "Estimation du Gas", installWallet: "Installez MetaMask ou OneKey", connected: "Portefeuille Connecte!", disconnected: "Portefeuille Deconnecte", txComplete: "Transaction Complete!", notConfigured: "Gardien Non Configure", noProtection: "Vos actifs n'ont aucune protection de recuperation", lockAssets: "Verrouiller les Actifs", createStream: "Creer un Flux", activateGuardian: "Activer le Gardien", amount: "Montant", duration: "Duree", frequency: "Frequence", recipient: "Destinataire (optionnel)", weekly: "Hebdomadaire", monthly: "Mensuel", days: "Jours", month: "Mois", months: "Mois", year: "An", yourPortfolio: "Votre Portefeuille", walletBalance: "Solde du Portefeuille", vaultStatus: "Etat du Coffre", activeDeposit: "Depot Actif", yieldLockStatus: "Etat du Yield Lock", lockedBalance: "Solde Verrouille", accumulated Profit: "Profit Accumule", unlockDate: "Date de Deverrouillage", guardianStatus: "Etat du Gardien", heritageAddress: "Adresse d'Heritage", protectionActive: "Protection Active", streamStatusLabel: "Etat du Flux", active: "Actif", inactive: "Inativo", progress: "Progression", remaining: "Restant", noActiveStreams: "Aucun flux actif", syncData: "Synchroniser", syncing: "Synchronisation...", dataSynced: "Donnees synchronisees!", disconnect: "Deconnecter", connectedWallet: "Portefeuille Connecte", addressCopied: "Adresse copiee!", view: "Voir", manageLocks: "Gerer les Verrous", configureGuardian: "Configurer le Gardien", noActiveLock: "Aucun Verrou Actif", noDeposit: "Aucun Depot", notConnected: "---" }
}

const pageColors: Record<string, string> = {
  vault: "#00D1FF",
  yield: "#A855F7",
  stream: "#10B981",
  guardian: "#F59E0B"
}

// ============================================
// CONFIGURAÇÕES DO CONTRATO (MUDE AQUI!)
// ============================================
const CONTRACT_ADDRESS = "0x4Ee7f03817Bf688c076B85c717f4bdE69d20ab54
" 
const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "guardian",
				"type": "address"
			}
		],
		"name": "GuardianSet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newGuardian",
				"type": "address"
			}
		],
		"name": "setGuardian",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "guardianOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
  "function balances(address) view returns (uint256)",
  "function guardians(address) view returns (address)",
  "function lockedBalances(address) view returns (uint256)",
  "function deposit() external payable",
  "function withdraw(uint256 amount) external",
  "function setGuardian(address guardian) external"
]

export default function ArcSovereign() {
  const [mounted, setMounted] = useState(false)
  const [activePage, setActivePage] = useState("vault")
  const [language, setLanguage] = useState<Language>("EN")
  const [selectedAsset, setSelectedAsset] = useState<"USDC" | "EURC">("USDC")
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  
  const [arcBalance, setArcBalance] = useState("0.0000")
  const [vaultBalance, setVaultBalance] = useState("0.00")
  const [yieldLockTotal, setYieldLockTotal] = useState("0.00")
  const [realTimeYieldEarned, setRealTimeYieldEarned] = useState("0.00000000")
  const [guardianConfigured, setGuardianConfigured] = useState("")
  
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [lockAmount, setLockAmount] = useState("")
  const [lockDuration, setLockDuration] = useState<"1m" | "6m" | "1y">("6m")
  const [guardianAddress, setGuardianAddress] = useState("")
  
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toasts, setToasts] = useState<any[]>([])
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const yieldEarnedRef = useRef(0)
  const mountedRef = useRef(false)
  const t = translations[language]

  const addToast = useCallback((type: string, message: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  // ===== BUSCAR DADOS REAIS =====
  const refreshData = useCallback(async (userAddress: string) => {
    const eth = (window as any).ethereum
    if (!eth || !userAddress) return
    
    try {
      const provider = new ethers.providers.Web3Provider(eth)
      
      // Saldo Nativo ARC
      const bal = await provider.getBalance(userAddress)
      setArcBalance(Number(ethers.utils.formatEther(bal)).toFixed(4))

      // Saldo Contrato
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      
      const vBal = await contract.balances(userAddress)
      setVaultBalance(ethers.utils.formatEther(vBal))

      const gAddr = await contract.guardians(userAddress)
      if (gAddr !== "0x0000000000000000000000000000000000000000") {
        setGuardianConfigured(gAddr.substring(0, 6) + "..." + gAddr.substring(38))
      }

      const lBal = await contract.lockedBalances(userAddress)
      setYieldLockTotal(ethers.utils.formatEther(lBal))

    } catch (err) {
      console.error("Erro ao carregar dados:", err)
    }
  }, [])

  // ===== CONEXÃO DA CARTEIRA =====
  const connectWallet = useCallback(async () => {
    const eth = (window as any).ethereum
    if (!eth) return addToast("error", t.installWallet)
    
    setIsConnecting(true)
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" })
      setWalletAddress(accounts[0])
      setIsConnected(true)
      localStorage.setItem("arc_wallet_address", accounts[0])
      refreshData(accounts[0])
      addToast("success", t.connected)
    } catch {
      addToast("error", "Failed to connect")
    }
    setIsConnecting(false)
  }, [t, addToast, refreshData])

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setArcBalance("0.0000")
    setVaultBalance("0.00")
    setYieldLockTotal("0.00")
    setRealTimeYieldEarned("0.00000000")
    yieldEarnedRef.current = 0
    localStorage.removeItem("arc_wallet_address")
  }

  // ===== CÁLCULO DE RENDIMENTO EM TEMPO REAL =====
  useEffect(() => {
    const lockedNum = parseFloat(yieldLockTotal) || 0
    if (lockedNum <= 0) {
      setRealTimeYieldEarned("0.00000000")
      return
    }

    const apy = lockDuration === "1m" ? 0.05 : lockDuration === "6m" ? 0.12 : 0.20
    const yieldPerSec = (lockedNum * apy) / 31536000

    const interval = setInterval(() => {
      yieldEarnedRef.current += yieldPerSec
      setRealTimeYieldEarned(yieldEarnedRef.current.toFixed(8))
    }, 1000)

    return () => clearInterval(interval)
  }, [yieldLockTotal, lockDuration])

  // ===== INICIALIZAÇÃO =====
  useEffect(() => {
    setMounted(true)
    const eth = (window as any).ethereum
    if (eth) {
      const saved = localStorage.getItem("arc_wallet_address")
      if (saved) {
        setWalletAddress(saved)
        setIsConnected(true)
        refreshData(saved)
      }
      eth.on("accountsChanged", (acc: any) => {
        if (acc[0]) { setWalletAddress(acc[0]); setIsConnected(true); refreshData(acc[0]) }
        else disconnectWallet()
      })
    }
  }, [refreshData])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: pageColors[activePage] }}>
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div className="font-bold text-lg">Arc Sovereign</div>
          </div>

          <nav className="hidden lg:flex gap-1 bg-white/5 p-1 rounded-xl">
            {["vault", "yield", "stream", "guardian"].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activePage === p ? 'text-black' : 'text-white/50'}`}
                style={{ backgroundColor: activePage === p ? pageColors[p] : 'transparent' }}
              >
                {t[p as keyof typeof t]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowLangDropdown(!showLangDropdown)} className="px-3 py-2 bg-white/5 rounded-lg text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" /> {language}
            </button>
            {isConnected ? (
              <button onClick={() => setIsPortfolioOpen(true)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-sm">
                {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}
              </button>
            ) : (
              <button onClick={connectWallet} className="px-6 py-2 rounded-xl font-bold text-black" style={{ backgroundColor: pageColors[activePage] }}>
                {isConnecting ? <Loader2 className="animate-spin w-4 h-4" /> : t.connect}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* VAULT */}
        {activePage === "vault" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-8">{t.vault}</h1>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/40 text-sm">{t.yourBalance}</p>
                <h3 className="text-2xl font-bold">{arcBalance} ARC</h3>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/40 text-sm">{t.deposited}</p>
                <h3 className="text-2xl font-bold">{vaultBalance} {selectedAsset}</h3>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/40 text-sm">{t.apy}</p>
                <h3 className="text-2xl font-bold text-green-400">5.00%</h3>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/40 text-sm">Real-time Yield</p>
                <h3 className="text-2xl font-mono font-bold text-cyan-400">0.00002341</h3>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ArrowDownToLine className="text-cyan-400"/> {t.deposit}</h2>
                <input 
                  type="number" 
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full bg-black border border-white/10 p-4 rounded-2xl text-2xl outline-none focus:border-cyan-400 transition-all mb-4"
                />
                <button onClick={() => setActiveModal("deposit")} className="w-full py-4 bg-cyan-400 text-black font-bold rounded-2xl hover:scale-[1.02] transition-all">
                  {t.deposit}
                </button>
              </div>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ArrowUpFromLine className="text-white/40"/> {t.withdraw}</h2>
                <input 
                  type="number" 
                  value={withdrawAmount} 
                  onChange={(e) => setWithdrawAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full bg-black border border-white/10 p-4 rounded-2xl text-2xl outline-none focus:border-white/30 transition-all mb-4"
                />
                <button onClick={() => setActiveModal("withdraw")} className="w-full py-4 bg-white/10 text-white/50 font-bold rounded-2xl border border-white/10">
                  {t.withdraw}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* YIELD LOCK */}
        {activePage === "yield" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-8">{t.yield}</h1>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { id: "1m", apy: "5%", time: "1 Month" },
                { id: "6m", apy: "12%", time: "6 Months" },
                { id: "1y", apy: "20%", time: "1 Year" }
              ].map((opt) => (
                <button 
                  key={opt.id} 
                  onClick={() => setLockDuration(opt.id as any)}
                  className={`p-8 rounded-3xl border transition-all text-left ${lockDuration === opt.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}
                >
                  <p className="text-white/40 mb-2">{opt.time}</p>
                  <h2 className="text-4xl font-bold text-purple-400">{opt.apy}</h2>
                </button>
              ))}
            </div>

            <div className="max-w-2xl mx-auto p-8 bg-white/5 rounded-3xl border border-white/10">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-white/40 text-sm">Locked Amount</p>
                    <h2 className="text-3xl font-bold">{yieldLockTotal} USDC</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-sm">Accumulated Profit</p>
                    <h2 className="text-3xl font-mono font-bold text-purple-400">+{realTimeYieldEarned}</h2>
                  </div>
               </div>
               <input 
                  type="number" 
                  value={lockAmount} 
                  onChange={(e) => setLockAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full bg-black border border-white/10 p-4 rounded-2xl text-2xl outline-none focus:border-purple-500 transition-all mb-6"
                />
               <button onClick={() => setActiveModal("lock")} className="w-full py-5 bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20">
                  {t.lockAssets}
               </button>
            </div>
          </motion.div>
        )}

        {/* GUARDIAN */}
        {activePage === "guardian" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{t.guardian}</h1>
            <p className="text-white/40 mb-8">Proteja seus ativos com um herdeiro digital.</p>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <label className="text-sm text-white/40 block mb-3">{t.heritageAddress}</label>
              <input 
                type="text" 
                value={guardianAddress} 
                onChange={(e) => setGuardianAddress(e.target.value)} 
                placeholder="0x..." 
                className="w-full bg-black border border-white/10 p-4 rounded-2xl font-mono text-sm outline-none focus:border-amber-500 transition-all mb-6"
              />
              <button onClick={() => setActiveModal("guardian")} className="w-full py-4 bg-amber-500 text-black font-bold rounded-2xl">
                {t.activateGuardian}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* PORTFOLIO SIDEBAR */}
      <AnimatePresence>
        {isPortfolioOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPortfolioOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-amber-500">{t.yourPortfolio}</h2>
                <button onClick={() => setIsPortfolioOpen(false)} className="p-2 bg-white/5 rounded-full"><X/></button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <p className="text-amber-500/60 text-sm mb-1">{t.walletBalance}</p>
                  <h2 className="text-3xl font-bold">{arcBalance} ARC</h2>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/40 text-sm mb-2">{t.vaultStatus}</p>
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold">{vaultBalance} USDC</h3>
                    <span className="text-xs text-green-400 flex items-center gap-1"><Check size={12}/> {t.active}</span>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/40 text-sm mb-2">{t.yieldLockStatus}</p>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{yieldLockTotal} USDC</h3>
                      <p className="text-xs text-white/40 mt-1">Locked</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-mono text-purple-400">+{realTimeYieldEarned}</h3>
                      <p className="text-xs text-white/40 mt-1">Earned</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/40 text-sm mb-2">{t.guardianStatus}</p>
                  {guardianConfigured ? (
                    <p className="font-mono text-sm text-amber-500 break-all">{guardianConfigured}</p>
                  ) : (
                    <p className="text-white/20 italic">{t.notConfigured}</p>
                  )}
                </div>

                <button onClick={disconnectWallet} className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl border border-red-500/20 mt-8">
                  {t.disconnect}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL SIMPLES */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4 capitalize">{activeModal}</h2>
            <p className="text-white/40 mb-8">Confirmar transação na rede Arc Testnet?</p>
            <div className="flex gap-4">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-white/5 rounded-xl">Cancelar</button>
              <button 
                onClick={async () => {
                  setIsProcessing(true)
                  await new Promise(r => setTimeout(r, 2000))
                  setIsProcessing(false)
                  setActiveModal(null)
                  addToast("success", t.txComplete)
                }} 
                className="flex-1 py-3 bg-amber-500 text-black font-bold rounded-xl"
              >
                {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="fixed bottom-4 right-4 z-[300] space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right">
            {toast.message}
          </div>
        ))}
      </div>

    </div>
  )
}
