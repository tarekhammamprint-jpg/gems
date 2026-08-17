<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /><title>حلوى النجوم - نظام المعارك المثالي</title><style>
    body { 
        margin: 0; padding: 0; background: radial-gradient(circle, #2c003e, #0f0c29); 
        display: flex; flex-direction: column; align-items: center; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        color: #fff; 
        touch-action: manipulation; 
        -webkit-user-select: none; user-select: none; 
        overflow: hidden; 
    }
    
    .user-bar { width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; background: rgba(0,0,0,0.6); box-sizing: border-box; border-bottom: 1px solid rgba(255,255,255,0.1); z-index: 50; position: relative;}
    .action-btns { display: flex; gap: 5px; flex-wrap: wrap; justify-content: flex-end;}
    .btn-small { color: white; border: none; padding: 6px 8px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px; transition: transform 0.1s;}
    .btn-small:active { transform: scale(0.9); }
    .btn-menu { background: #3498db; }
    .btn-logout { background: #ff4d4d; }
    .btn-spin { background: #e67e22; }
    .btn-surrender { background: #ff9800; display: none; } 
    .btn-support { background: #e67e22; display: none; animation: pulseWager 1.5s infinite; } 

    /* القائمة المنسدلة */
    .user-dropdown-container { display: flex; align-items: center; position: relative; cursor: pointer; padding: 5px 10px; background: rgba(255,255,255,0.1); border-radius: 8px; transition: background 0.2s; }
    .user-dropdown-container:hover { background: rgba(255,255,255,0.2); }
    .user-dropdown-container span { font-size: 15px; font-weight: bold; color: #66ff99; }
    .user-menu-dropdown {
        position: absolute; top: 110%; left: 0; background: rgba(20, 15, 50, 0.98);
        border: 2px solid #ffd54f; border-radius: 12px; padding: 15px;
        width: 230px; z-index: 300; display: flex; flex-direction: column; gap: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.9); backdrop-filter: blur(8px);
        transition: opacity 0.2s, transform 0.2s; transform-origin: top left;
    }
    .user-menu-dropdown.hidden { opacity: 0; transform: scale(0.8); pointer-events: none; }
    .um-name { font-size: 22px !important; font-weight: bold; color: #ffd54f !important; text-align: center; display:block !important; margin-bottom: 5px;}
    .um-level { font-size: 14px !important; color: #66ff99 !important; text-align: center; display:block !important;}
    .um-progress-box { background: rgba(0,0,0,0.5); padding: 8px; border-radius: 8px; border: 1px solid #3498db; text-align: center;}
    .um-progress-text { font-size: 12px !important; color: #ddd !important; display:block !important;}
    .um-progress-bar-container { width: 100%; background: #333; border-radius: 10px; height: 10px; margin-top: 5px; overflow: hidden;}
    .um-progress-bar { height: 100%; background: #00e676; width: 0%; transition: width 0.3s; }
    .user-menu-dropdown hr { width: 100%; border-color: rgba(255,255,255,0.1); margin: 5px 0; border-style: solid; }
    .um-btn { background: rgba(255,255,255,0.1); border: 1px solid #3498db; color: white; padding: 8px; border-radius: 5px; cursor: pointer; transition: background 0.2s; font-weight: bold; font-size: 13px; }
    .um-btn:hover { background: rgba(52, 152, 219, 0.5); }

    .sidebar { position: fixed; right: -300px; top: 0; width: 280px; height: 100%; background: rgba(15, 12, 41, 0.95); border-left: 2px solid #3498db; transition: right 0.3s ease; z-index: 200; padding: 20px; box-sizing: border-box; box-shadow: -5px 0 15px rgba(0,0,0,0.5); backdrop-filter: blur(5px); display: flex; flex-direction: column;}
    .sidebar.open { right: 0; }
    .sidebar-close { position: absolute; top: 10px; left: 10px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
    .players-title { font-size: 16px; margin-bottom: 10px; color: #ffd54f; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-top: 20px;}
    .search-bar { width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #3498db; background: rgba(0,0,0,0.5); color: white; outline: none; box-sizing: border-box; font-family: inherit;}
    .filter-tabs { display: flex; width: 100%; gap: 5px; margin-bottom: 10px; }
    .tab-btn { flex: 1; padding: 8px; border: 1px solid #3498db; background: rgba(0,0,0,0.5); color: white; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px; transition: background 0.2s;}
    .tab-btn.active-tab { background: #3498db; color: #fff; }
    .players-container { overflow-y: auto; flex-grow: 1; padding-right: 5px; }
    .player-row { display: flex; flex-direction: column; background: rgba(255,255,255,0.05); margin-bottom: 8px; padding: 10px; border-radius: 8px; position: relative;}
    .p-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; display: flex; align-items: center; flex-wrap: wrap;}
    .p-title { font-size: 10px; color: #aaa; margin-right: 5px; font-weight: normal; }
    .p-score { font-size: 14px; color: #66ff99; font-weight: bold; margin-bottom: 8px; }
    
    .btn-group { display: flex; gap: 5px; }
    .challenge-btn { background: #00e676; color: #000; border: none; padding: 5px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 12px; flex: 1;}
    .challenge-btn:hover { background: #b2ff59; }
    .gift-btn { background: #9b59b6; color: #fff; border: none; padding: 5px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 12px; flex: 1;}
    .gift-btn:hover { background: #8e44ad; }
    .admin-controls { display: flex; gap: 5px; margin-top: 5px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;}
    .ban-btn { background: #7f8c8d; color: #fff; border: none; padding: 5px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 11px; flex: 1;}
    .banned-text { color: #ff4d4d; font-size: 12px; font-weight: bold; }
    .status-dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-left: 8px; }
    .online { background-color: #00e676; box-shadow: 0 0 6px #00e676; }
    .offline { background-color: #777; }

    .header { display: flex; width: 100%; max-width: 480px; justify-content: space-around; padding: 10px 0; background: rgba(255, 255, 255, 0.05); margin-bottom: 15px; margin-top: 5px; border-radius: 10px; position: relative; z-index: 20;}
    .info-box { text-align: center; padding: 5px; border-radius: 8px; transition: transform 0.3s; }
    .info-box.highlight { background: rgba(102, 255, 153, 0.3); transform: scale(1.1); box-shadow: 0 0 15px #66ff99; }
    .info-box.lose-highlight { background: rgba(255, 51, 102, 0.3); transform: scale(0.9); box-shadow: 0 0 15px #ff3366; }
    .label { font-size: 12px; opacity: 0.8; margin-bottom: 2px; }
    .value { font-size: 20px; font-weight: bold; color: #ffd54f; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .money-color { color: #66ff99; }
    .wager-color { color: #ff3366; text-shadow: 0 0 8px #ff3366; animation: pulseWager 1.5s infinite; }
    .vs-mode { color: #ff3366; animation: pulse 0.5s infinite alternate; }
    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.1); } }
    @keyframes pulseWager { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

    .game-area { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100vw; }
    
    .grid { 
        display: grid; 
        grid-template-columns: repeat(8, 1fr); 
        grid-template-rows: repeat(8, 1fr); 
        gap: 2px;
        width: 95vw; max-width: 340px; 
        height: 95vw; max-height: 340px;
        background: rgba(0, 0, 0, 0.4); border-radius: 12px; padding: 6px; 
        box-sizing: border-box; box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.1); 
        border: 2px solid rgba(255,255,255,0.15); position: relative; 
        touch-action: none;
    }
    
    .grid div { 
        width: 100%; height: 100%; margin: 0; 
        background-size: 90%; background-repeat: no-repeat; background-position: center; 
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s; 
        border-radius: 8px; 
        -webkit-tap-highlight-color: transparent; box-sizing: border-box; pointer-events: auto; touch-action: none;
    }
    .grid div:active { transform: scale(0.85); }
    .grid .selected { background-color: rgba(255, 255, 255, 0.2); box-shadow: 0 0 15px #fff, inset 0 0 10px #fff; transform: scale(1.1); z-index: 10; }
    .fade-out { opacity: 0; transform: scale(0); }
    @keyframes candyPop { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
    .grid div.new-candy { animation: candyPop 0.4s ease-out forwards; }

    .floating-reward { position: absolute; color: #66ff99; font-size: 28px; font-weight: 900; text-shadow: 0 0 15px #00e676, 2px 2px 5px #000; z-index: 100; pointer-events: none; animation: floatUp 1s ease-out forwards; }
    @keyframes floatUp { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-60px) scale(1.5); } }
    .trophy-icon { font-size: 80px; animation: popSticker 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-shadow: 0 0 30px #ffd54f; margin: 10px 0; }

    /* مهارة المعركة */
    .skill-bar { display: none; justify-content: center; width: 95vw; max-width: 340px; margin-top: 15px; }
    .skill-btn { width: 100%; background: linear-gradient(90deg, #8e44ad, #c0392b); border: 2px solid #ffd54f; color: #fff; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: transform 0.1s; font-size: 15px; text-shadow: 1px 1px 2px #000; box-shadow: 0 4px 15px rgba(0,0,0,0.5);}
    .skill-btn:active { transform: scale(0.95); }
    .skill-btn:disabled { background: #555; border-color: #333; color: #888; cursor: not-allowed; box-shadow: none; text-shadow: none;}

    .chat-btn-float { position: fixed; bottom: 20px; right: 20px; background: #3498db; color: white; border: none; border-radius: 50%; width: 55px; height: 55px; font-size: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); cursor: pointer; z-index: 60; display: none; transition: transform 0.2s; }
    .chat-btn-float:active { transform: scale(0.9); }
    .chat-badge { position: absolute; top: -2px; right: -2px; background: #ff3366; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #0f0c29; display: none; }
    .chat-preview-bubble { position: fixed; right: 20px; color: #fff; font-size: 14px; z-index: 55; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 1; transform: translateY(0); transition: opacity 0.3s, transform 0.3s; pointer-events: none; border-radius: 12px; border-bottom-right-radius: 2px; padding: 10px 15px; }
    .chat-preview-bubble.hidden { opacity: 0; transform: translateY(15px); }

    .chat-panel { position: fixed; bottom: 85px; right: 10px; width: calc(100vw - 20px); max-width: 320px; height: 380px; background: rgba(20, 15, 50, 0.95); border: 2px solid #3498db; border-radius: 15px; z-index: 60; display: flex; flex-direction: column; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.8); backdrop-filter: blur(8px); overflow: hidden; }
    .chat-header { background: rgba(0,0,0,0.5); padding: 10px; text-align: center; font-weight: bold; color: #ffd54f; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
    .close-chat { background: none; border: none; color: #ff4d4d; font-size: 20px; cursor: pointer; }
    .chat-messages { flex-grow: 1; padding: 10px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
    .msg { padding: 8px 12px; border-radius: 15px; font-size: 14px; max-width: 75%; word-wrap: break-word; animation: slideIn 0.2s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .msg.me { background: #00e676; color: #000; align-self: flex-start; border-bottom-right-radius: 2px; }
    .msg.opp { background: #3498db; color: #fff; align-self: flex-end; border-bottom-left-radius: 2px; }
    .msg.sticker { background: transparent !important; font-size: 45px; padding: 0; animation: popSticker 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .stickers-bar { display: flex; gap: 8px; padding: 8px; background: rgba(0,0,0,0.6); overflow-x: auto; border-top: 1px solid rgba(255,255,255,0.05); }
    .stk-btn { background: none; border: none; font-size: 24px; cursor: pointer; transition: transform 0.2s; padding: 0; }
    .stk-btn:active { transform: scale(1.4); }
    .chat-controls { display: flex; padding: 8px; background: rgba(0,0,0,0.8); }
    .chat-input { flex-grow: 1; border: none; border-radius: 20px; padding: 8px 15px; outline: none; margin-left: 8px; background: rgba(255,255,255,0.9); font-family: inherit;}
    .chat-send { background: #ffd54f; border: none; border-radius: 50%; width: 35px; height: 35px; font-weight: bold; cursor: pointer; font-size: 16px; }

    .modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(8px); opacity: 1; transition: opacity 0.2s; }
    .modal.hidden { opacity: 0; pointer-events: none; }
    .modal-content { background: linear-gradient(135deg, #4a148c, #1a237e); padding: 25px; border-radius: 20px; text-align: center; border: 2px solid #ffd54f; width: 85%; max-width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); transform: scale(1); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .modal.hidden .modal-content { transform: scale(0.8); }
    .modal-title { margin-top: 0; font-size: 22px; color: #fff; margin-bottom: 15px;}
    .modal-body { font-size: 15px; line-height: 1.5; margin-bottom: 20px; color: #ddd; }
    .modal-input { width: 90%; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: none; font-size: 16px; text-align: center; outline: none; font-weight: bold;}
    .modal-btn-group { display: flex; gap: 10px; flex-direction: column;}
    .btn-primary { background: #ffd54f; color: #000; border: none; padding: 12px 20px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; width: 100%; transition: transform 0.1s;}
    .btn-primary:active { transform: scale(0.95); }
    .btn-secondary { background: #555; color: #fff; border: none; padding: 12px 20px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; width: 100%; transition: transform 0.1s;}
    .btn-secondary:active { transform: scale(0.95); }
    .login-guide { background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; margin-bottom: 15px; text-align: right; font-size: 13px; line-height: 1.6; color: #ddd; border-right: 3px solid #66ff99;}
    .login-guide span { color: #ffd54f; font-weight: bold; }
    .wait-spinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #ffd54f; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 15px auto; }
</style>     
<div class="sidebar" id="sidebar">
	         
	<button class="sidebar-close" onclick="window.toggleSidebar()">
		        ❌     
	</button>
	         
	<div class="players-title">
		        🏆 المتصدرون والمنافسون     
	</div>
	    <input type="text" id="searchPlayerInput" class="search-bar" placeholder="ابحث عن اسم لاعب..." onkeyup="window.filterPlayers()" />       
	<div class="filter-tabs">
		                         
		<button onclick="window.setFilterTab('all')" class="tab-btn active-tab" id="tabAll">
			            الكل         
		</button>
		                         
		<button onclick="window.setFilterTab('online')" class="tab-btn" id="tabOnline">
			            المتصلون الآن         
		</button>
		             
	</div>
	         
	<div id="playersList" class="players-container">
		    
	</div>
</div>
<div class="user-bar">
	         
	<div class="user-dropdown-container" id="userProfileBox" onclick="window.toggleProfileMenu(event)">
		        <span><span id="playerFlag">🌍</span> <span id="playerName">لاعب</span> <span class="dropdown-arrow">▼</span></span>                         
		<div id="userMenu" class="user-menu-dropdown hidden">
			            <span class="um-name" id="umName">لاعب</span>            <span class="um-level">المستوى: <strong id="umLevel">1</strong></span>                        
			<div class="um-progress-box">
				                <span class="um-progress-text">مباريات للمستوى القادم: <span id="umMatchesLeft">5</span></span>                                
				<div class="um-progress-bar-container">
					                    
					<div id="umProgressBar" class="um-progress-bar">
						                    
					</div>
					                
				</div>
				                         
			</div>
			                         
			<hr />
			                         
			<button class="um-btn" onclick="window.editUserName(event)">
				                تعديل الاسم ✎             
			</button>
			                         
			<button class="um-btn" onclick="window.editPassword(event)">
				                تعديل كلمة المرور 🔒             
			</button>
			                 
		</div>
		             
	</div>
	                                 
	<div class="action-btns">
		                 
		<button class="btn-small btn-support" id="supportBtn" onclick="window.claimSupport()">
			            دعم 🆘         
		</button>
		                 
		<button class="btn-small btn-spin" id="spinBtn" onclick="window.openSpinWheel()">
			            عجلة الحظ 🎨         
		</button>
		                 
		<button style="background: #8e44ad;" class="btn-small" id="randomBtn" onclick="window.startRandomMatch()">
			            عشوائي 🎲         
		</button>
		                 
		<button class="btn-small btn-menu" id="menuBtn" onclick="window.toggleSidebar()">
			            المنافسون 👥         
		</button>
		                 
		<button class="btn-small btn-logout" id="logoutBtn" onclick="window.logout()">
			            خروج         
		</button>
		                 
		<button class="btn-small btn-surrender" id="surrenderBtn" onclick="window.surrenderBattle()">
			            انسحاب 🏳         
		</button>
		             
	</div>
</div>
  
<div class="header">
	         
	<div class="info-box">
		                 
		<div class="label">
			            الحركات         
		</div>
		                 
		<div class="value" id="movesDisplay">
			            25         
		</div>
		             
	</div>
	         
	<div class="info-box" id="wagerBox" style="display:none;">
		                 
		<div class="label">
			            الرهان         
		</div>
		                 
		<div class="value wager-color" id="wagerDisplay">
			            $0         
		</div>
		             
	</div>
	         
	<div class="info-box" id="scoreWrapper">
		                 
		<div class="label" id="scoreLabel">
			            الرصيد         
		</div>
		                 
		<div class="value money-color" id="scoreDisplay">
			            $0         
		</div>
		             
	</div>
	         
	<div class="info-box" id="targetWrapper">
		                 
		<div class="label" id="targetLabel">
			            المستوى         
		</div>
		                 
		<div class="value target-color" id="targetDisplay">
			            1         
		</div>
		             
	</div>
</div>
 
<div class="game-area">
	         
	<div class="grid" id="grid">
		    
	</div>
	         
	<div class="skill-bar" id="skillBar" style="display:none;">
		                 
		<button class="skill-btn" id="ultimateBtn" onclick="window.useUltimateStrike()">
			            ⚡ الضربة الساحقة ($50)         
		</button>
		             
	</div>
</div>
      
<button class="chat-btn-float" id="chatBtn" onclick="window.toggleChat()">
	    💬<span class="chat-badge" id="chatBadge"></span>
</button>
<div class="chat-preview-bubble hidden" id="chatPreviewBubble">
</div>
 
<div class="chat-panel" id="chatPanel">
	         
	<div class="chat-header">
		        <span>دردشة المعركة</span>                
		<button class="close-chat" onclick="window.toggleChat()">
			            ❌         
		</button>
		             
	</div>
	         
	<div class="chat-messages" id="chatMessages">
		    
	</div>
	         
	<div class="stickers-bar">
		                 
		<button class="stk-btn" onclick="window.sendChat('😂', true)">
			            😂         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('😭', true)">
			            😭         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('😡', true)">
			            😡         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('😍', true)">
			            😍         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('👍', true)">
			            👍         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('👎', true)">
			            👎         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('💀', true)">
			            💀         
		</button>
		                 
		<button class="stk-btn" onclick="window.sendChat('🎉', true)">
			            🎉         
		</button>
		             
	</div>
	         
	<div class="chat-controls">
		        <input type="text" id="chatInput" class="chat-input" placeholder="رسالة..." onkeypress="if(event.key === 'Enter') window.submitTextChat()" />                                               
		<button class="chat-send" onclick="window.submitTextChat()">
			            ➡         
		</button>
		             
	</div>
</div>
 
<div id="dynamicModal" class="modal hidden">
	         
	<div class="modal-content">
		                 
		<h2 id="dmTitle" class="modal-title">
			            العنوان         
		</h2>
		                 
		<div id="dmBody" class="modal-body">
			            الرسالة         
		</div>
		        <input type="text" id="dmInput1" class="modal-input" style="display:none;" />        <input type="password" id="dmInput2" class="modal-input" style="display:none;" />                                              
		<div class="modal-btn-group" id="dmBtnGroup">
			                         
			<button id="dmConfirmBtn" class="btn-primary">
				                موافق ✅             
			</button>
			                         
			<button id="dmCancelBtn" class="btn-secondary" style="display:none;">
				                إلغاء ❌             
			</button>
			                     
		</div>
		             
	</div>
</div>
 <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
    import { getDatabase, ref, set, get, onValue, update, remove, onDisconnect } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSyBGwo-ds88ucY9MTDxx7x_rPppnThvjiGc",
        authDomain: "gems-d8ae3.firebaseapp.com",
        projectId: "gems-d8ae3",
        storageBucket: "gems-d8ae3.firebasestorage.app",
        messagingSenderId: "747420762454",
        appId: "1:747420762454:web:302f25d10893180263d6f7"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    function getFlagEmoji(countryCode) {
        if(!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) return '&#127757;'; 
        const char1 = 127397 + countryCode.charCodeAt(0);
        const char2 = 127397 + countryCode.charCodeAt(1);
        return `&#${char1};&#${char2};`;
    }
    window.getFlagEmoji = getFlagEmoji;

    function getSafeFlag(flagValue) {
        if (!flagValue || typeof flagValue !== 'string' || flagValue.includes('?')) {
            return '&#127757;'; 
        }
        if (flagValue === '????️' || flagValue === '&#127987;' || flagValue === '\uD83C\uDFF3\uFE0F') {
            return '&#127757;'; 
        }
        return flagValue;
    }
    window.getSafeFlag = getSafeFlag;

    window.currentUser = null; window.userData = { balance: 0, level: 1, flag: '&#127757;', isSearching: false, battlesPlayed: 0, lastSupportTime: 0, soloGamesPlayed: 0, lastSpinTime: 0, lastGiftTime: 0 }; window.usersList = {};
    window.currentFilterTab = 'all'; window.botChallengeSent = false; window.battleEnded = false;
    window.battleMode = false; window.battleRole = null; window.currentBattleWager = 0;
    window.opponentName = ""; window.unsubTargetBattle = null; window.disconnectRef = null; 
    window.lastMsgId = 0; let previewTimeout = null;
    window.amIConnected = false; window.battlePingInterval = null; window.battleMonitorInterval = null;
    window.lastOpponentPingTime = Date.now(); window.lastOpponentPingValue = null;
    window.isWaitingForOpponent = false; window.domUpdateInterval = null;
    window.hasUsedSkill = false;
    
    const rawBotsData = [
        {n:"ريم عبدالصمد",c:'EG'},{n:"سارة محمود",c:'SA'},{n:"نورهان أحمد",c:'AE'},{n:"مريم ميمي",c:'MA'},
        {n:"ليلى سعيد",c:'DZ'},{n:"ياسمين جمال",c:'JO'},{n:"فاطمة علي",c:'TN'},{n:"نور كمال",c:'IQ'},
        {n:"شهد إبراهيم",c:'SY'},{n:"آية حسن",c:'LB'},{n:"ملك مصطفى",c:'KW'},{n:"حبيبة وليد",c:'QA'},
        {n:"جنى خالد",c:'BH'},{n:"ندى عادل",c:'OM'},{n:"روان يحيى",c:'YE'},{n:"دنيا فانية",c:'SD'},
        {n:"هبة جلال",c:'LY'},{n:"أميرة صبحي",c:'PS'},{n:"ميرنا جميل",c:'EG'},{n:"رقية ماجد",c:'SA'},
        {n:"أحمد حسن",c:'AE'},{n:"عمر محمود",c:'MA'},{n:"خالد عبدالله",c:'DZ'},{n:"اسراء اشرف",c:'IQ'},
        {n:'MARTINA',c:'EG'},{n:"يوسف شعبان",c:'PS'}
    ];

    window.botsData = rawBotsData.map((bot, index) => ({
        name: bot.n, code: bot.c, flag: getFlagEmoji(bot.c), level: 5 + (index * 2) 
    }));

    window.isBotMatch = false; window.botInterval = null; window.botDone = false; window.playerDone = false; window.botScore = 0; window.botMoves = 25;

    const width = 8; let squares = []; let boardTypes = []; let moves = 25; let level = 1; let currentLevelScore = 0;
    let selectedSquare = null; let isAnimating = false;
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('scoreDisplay'); const movesDisplay = document.getElementById('movesDisplay');
    const targetDisplay = document.getElementById('targetDisplay'); const scoreLabel = document.getElementById('scoreLabel'); const targetLabel = document.getElementById('targetLabel');

    let audioCtx = null;
    try {
        document.body.addEventListener('click', function() { 
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
                if (audioCtx.state === 'suspended') audioCtx.resume(); 
            } catch(e) {}
        }, {once:true});
    } catch(e) {}

    function playSound(type) {
        try {
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime; 
            
            function createTone(wave, freq, vol, timeStart, duration, freqGlideTo) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = wave;
                osc.frequency.setValueAtTime(freq, timeStart);
                if(freqGlideTo) osc.frequency.exponentialRampToValueAtTime(freqGlideTo, timeStart + duration);
                
                gain.gain.setValueAtTime(vol, timeStart);
                gain.gain.exponentialRampToValueAtTime(0.001, timeStart + duration);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(timeStart);
                osc.stop(timeStart + duration);
            }

            if (type === 'click') { 
                createTone('sine', 400, 0.1, now, 0.1, 200); 
            } 
            else if (type === 'tick') { 
                createTone('sine', 800, 0.05, now, 0.05); 
            } 
            else if (type === 'match') { 
                createTone('sine', 523.25, 0.15, now, 0.2);
                createTone('sine', 659.25, 0.1, now + 0.05, 0.2);
            } 
            else if (type === 'epic_match') { 
                createTone('sine', 523.25, 0.15, now, 0.3);
                createTone('sine', 659.25, 0.15, now + 0.1, 0.3);
                createTone('sine', 783.99, 0.15, now + 0.2, 0.4);
            } 
            else if (type === 'error') { 
                createTone('triangle', 200, 0.2, now, 0.2, 100); 
            } 
            else if (type === 'win') { 
                createTone('sine', 440, 0.1, now, 0.3);
                createTone('sine', 554, 0.1, now + 0.15, 0.3);
                createTone('sine', 659, 0.1, now + 0.3, 0.3);
                createTone('sine', 880, 0.15, now + 0.45, 0.6);
            } 
            else if (type === 'lose') { 
                createTone('triangle', 349, 0.1, now, 0.4);
                createTone('triangle', 329, 0.1, now + 0.2, 0.4);
                createTone('triangle', 293, 0.15, now + 0.4, 0.6);
            } 
            else if (type === 'alert') { 
                createTone('sine', 600, 0.1, now, 0.2, 800);
            }
            else if (type === 'msg_pop') { 
                createTone('sine', 800, 0.05, now, 0.1, 1000);
            }
            else if (type === 'coin') { 
                createTone('sine', 1200, 0.05, now, 0.15, 1600);
            }
        } catch(e) {}
    }
    window.playSound = playSound;

    function animateMoneyTransfer(winnerIsMe, amount, callback) {
        const myBoxWrapper = document.getElementById('scoreWrapper');
        const oppBoxWrapper = document.getElementById('targetWrapper');
        
        const startBox = winnerIsMe ? oppBoxWrapper.getBoundingClientRect() : myBoxWrapper.getBoundingClientRect();
        const endBox = winnerIsMe ? myBoxWrapper.getBoundingClientRect() : oppBoxWrapper.getBoundingClientRect();

        if(winnerIsMe) {
            myBoxWrapper.classList.add('highlight');
            oppBoxWrapper.classList.add('lose-highlight');
        } else {
            oppBoxWrapper.classList.add('highlight');
            myBoxWrapper.classList.add('lose-highlight');
        }

        const numCoins = 15;
        let completed = 0;

        playSound('win'); 

        for (let i = 0; i < numCoins; i++) {
            let coin = document.createElement('div');
            coin.innerHTML = '&#128181;'; 
            coin.style.position = 'fixed';
            coin.style.fontSize = '35px';
            coin.style.zIndex = '9999';
            coin.style.pointerEvents = 'none';
            coin.style.left = (startBox.left + startBox.width/2 - 15) + 'px';
            coin.style.top = (startBox.top + startBox.height/2 - 15) + 'px';
            coin.style.transition = `all ${0.6 + Math.random() * 0.4}s cubic-bezier(0.25, 1, 0.5, 1)`;
            
            let scatterX = (Math.random() - 0.5) * 80;
            let scatterY = (Math.random() - 0.5) * 80;
            coin.style.transform = `translate(${scatterX}px, ${scatterY}px) scale(0.5) rotate(${Math.random()*360}deg)`;
            coin.style.opacity = '0';

            document.body.appendChild(coin);

            setTimeout(() => {
                coin.style.opacity = '1';
                playSound('coin');
                coin.style.transform = `translate(${endBox.left - startBox.left}px, ${endBox.top - startBox.top}px) scale(1.2) rotate(${Math.random()*360}deg)`;
            }, 50 + i * 40);

            setTimeout(() => {
                coin.style.opacity = '0';
                coin.style.transform += ' scale(0)';
                setTimeout(() => {
                    if(coin.parentNode) coin.parentNode.removeChild(coin);
                    completed++;
                    if (completed === numCoins) {
                        myBoxWrapper.classList.remove('highlight', 'lose-highlight');
                        oppBoxWrapper.classList.remove('highlight', 'lose-highlight');
                        if(callback) callback();
                    }
                }, 300);
            }, 800 + i * 40);
        }
    }

    window.AppModal = {
        show: function(options) {
            const modal = document.getElementById('dynamicModal');
            const title = document.getElementById('dmTitle'); const body = document.getElementById('dmBody');
            const inp1 = document.getElementById('dmInput1'); const inp2 = document.getElementById('dmInput2');
            const btnConfirm = document.getElementById('dmConfirmBtn'); const btnCancel = document.getElementById('dmCancelBtn');

            title.innerHTML = options.title || "رسالة"; body.innerHTML = options.html || '';
            inp1.style.display = 'none'; inp2.style.display = 'none'; inp1.value = ''; inp2.value = '';
            
            if (options.type === 'login') {
                inp1.style.display = 'block'; inp1.type = 'text'; inp1.placeholder = "اسم المستخدم";
                inp2.style.display = 'block'; inp2.type = 'password'; inp2.placeholder = "كلمة المرور";
            } else if (options.type === 'prompt') {
                inp1.style.display = 'block'; inp1.type = options.inputType || 'number'; inp1.placeholder = options.placeholder || "الكمية...";
                setTimeout(() => inp1.focus(), 100);
            }

            btnConfirm.innerHTML = options.confirmText || "موافق &#x2705;";
            btnConfirm.style.display = 'block';
            btnConfirm.style.background = options.confirmColor || '#ffd54f';
            btnConfirm.style.color = (options.confirmColor && options.confirmColor !== '#ffd54f') ? '#fff' : '#000';
            
            btnConfirm.onclick = () => {
                playSound('click');
                if (options.autoClose !== false) modal.classList.add('hidden');
                if (options.onConfirm) {
                    if (options.type === 'login') options.onConfirm(inp1.value.trim(), inp2.value.trim());
                    else if (options.type === 'prompt') options.onConfirm(inp1.value);
                    else options.onConfirm();
                }
            };

            if (options.showCancel) {
                btnCancel.style.display = 'block'; btnCancel.innerHTML = options.cancelText || "إلغاء &#x274C;";
                btnCancel.onclick = () => { playSound('click'); modal.classList.add('hidden'); if(options.onCancel) options.onCancel(); };
            } else { btnCancel.style.display = 'none'; }
            modal.classList.remove('hidden');
        },
        close: function() { document.getElementById('dynamicModal').classList.add('hidden'); },
        showWait: function(title, msg) { this.show({ title: title, html: `<div class="wait-spinner"></div><p>${msg}</p>`, confirmText: "إلغاء الانتظار", onConfirm: () => { window.surrenderBattle(); } }); },
        alert: function(msg) { this.show({ title: "تنبيه &#x26A0;", html: msg }); }
    };

    window.showDynamicWaitModal = function(myScore, oppScore, oppName) {
        AppModal.show({
            title: "انتهت حركاتك! &#x23F3;", 
            html: `
                <div class="wait-spinner"></div>
                <p>ننتظر <strong style="color:#ffd54f">${oppName}</strong> لينهي حركاته...</p>
                <div style="display:flex; justify-content:space-around; margin-top:15px; font-size:18px; background:rgba(0,0,0,0.5); padding:10px; border-radius:10px; border:1px solid #3498db;">
                    <div>نقاطك<br><strong style="color:#66ff99">${myScore}</strong></div>
                    <div>${oppName}<br><strong style="color:#ff3366" id="waitingOppScore">${oppScore}</strong></div>
                </div>
            `,
            showCancel: false, 
            confirmText: "انسحاب (خسارة)", 
            confirmColor: "#ff4d4d",
            onConfirm: () => { window.surrenderBattle(); }
        });
    };

    window.updateWaitingScreen = function(myScore, oppScore, oppName) {
        let bodyEl = document.getElementById('dmBody');
        if (bodyEl && window.isWaitingForOpponent) {
            bodyEl.innerHTML = `
                <div class="wait-spinner"></div>
                <p>ننتظر <strong style="color:#ffd54f">${oppName}</strong> لينهي حركاته...</p>
                <div style="display:flex; justify-content:space-around; margin-top:15px; font-size:18px; background:rgba(0,0,0,0.5); padding:10px; border-radius:10px; border:1px solid #3498db;">
                    <div>نقاطك<br><strong style="color:#66ff99">${myScore}</strong></div>
                    <div>${oppName}<br><strong style="color:#ff3366" id="waitingOppScore">${oppScore}</strong></div>
                </div>
            `;
        }
    };

    window.toggleProfileMenu = function(e) {
        if(e) e.stopPropagation();
        playSound('click');
        const menu = document.getElementById('userMenu');
        menu.classList.toggle('hidden');
        if(!menu.classList.contains('hidden')) {
            updateUserMenuInfo();
        }
    }
    
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('userMenu');
        if (menu && !menu.classList.contains('hidden') && !e.target.closest('#userProfileBox')) {
            menu.classList.add('hidden');
        }
    });

    function updateUserMenuInfo() {
        document.getElementById('umName').innerText = window.currentUser || "لاعب";
        document.getElementById('umLevel').innerText = "المستوى: " + (window.userData.level || 1);
        
        let totalPlayed = (window.userData.battlesPlayed || 0) + (window.userData.soloGamesPlayed || 0);
        let matchesLeft = 5 - (totalPlayed % 5);
        let progressPercent = ((5 - matchesLeft) / 5) * 100;
        
        document.getElementById('umMatchesLeft').innerText = matchesLeft;
        document.getElementById('umProgressBar').style.width = progressPercent + '%';
    }

    window.editUserName = function(e) {
        if(e) e.stopPropagation();
        document.getElementById('userMenu').classList.add('hidden');
        AppModal.show({
            title: "تعديل الاسم &#x270E;",
            type: 'prompt',
            inputType: 'text',
            placeholder: "الاسم الجديد...",
            showCancel: true,
            confirmText: "حفظ التغيير &#x2705;",
            onConfirm: (newName) => {
                newName = newName.trim();
                if(!newName || newName === window.currentUser) return;
                
                get(ref(db, `users/${newName}`)).then(snap => {
                    if(snap.exists()) {
                        AppModal.alert("هذا الاسم مستخدم مسبقاً، يرجى اختيار اسم آخر.");
                    } else {
                        let oldData = {...window.userData};
                        set(ref(db, `users/${newName}`), oldData).then(() => {
                            remove(ref(db, `users/${window.currentUser}`));
                            window.currentUser = newName;
                            localStorage.setItem('candyUser', newName);
                            document.getElementById('playerName').innerText = newName;
                            AppModal.alert("تم تغيير الاسم بنجاح!");
                        });
                    }
                });
            }
        });
    };

    window.editPassword = function(e) {
        if(e) e.stopPropagation();
        document.getElementById('userMenu').classList.add('hidden');
        AppModal.show({
            title: "تعديل كلمة المرور &#x1F512;",
            type: 'prompt',
            inputType: 'text',
            placeholder: "كلمة المرور الجديدة...",
            showCancel: true,
            confirmText: "تحديث &#x2705;",
            onConfirm: (newPass) => {
                newPass = newPass.trim();
                if(!newPass) return;
                update(ref(db, `users/${window.currentUser}`), { password: newPass }).then(() => {
                    localStorage.setItem('candyPass', newPass);
                    window.userData.password = newPass;
                    AppModal.alert("تم تغيير كلمة المرور بنجاح!");
                });
            }
        });
    };

    window.openSpinWheel = function() {
        playSound('click');
        let now = Date.now();
        let lastSpin = window.userData.lastSpinTime || 0;
        let cooldown = 24 * 60 * 60 * 1000;
        
        if (now - lastSpin < cooldown) {
            let remaining = cooldown - (now - lastSpin);
            let hours = Math.floor(remaining / (1000 * 60 * 60));
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            return AppModal.alert(`عذراً! لقد استخدمت لفتك المجانية. عد بعد ${hours} ساعة و ${minutes} دقيقة.`);
        }
        
        AppModal.show({
            title: "عجلة الحظ &#x1F3A8;",
            html: `<div id="wheelContainer" style="font-size:60px; text-align:center; transition: transform 2s cubic-bezier(0.25, 1, 0.5, 1); margin-bottom:15px;">&#x1F3B2;</div>
                   <p style="text-align:center; color:#ddd; font-size:13px;">الجوائز: +$1000, +5 مستويات, -$100, +$1</p>`,
            confirmText: `لف العجلة (مجاناً)`,
            autoClose: false,
            showCancel: true,
            onConfirm: () => {
                window.userData.lastSpinTime = now;
                update(ref(db, `users/${window.currentUser}`), { lastSpinTime: now });
                
                playSound('tick');
                document.getElementById('dmConfirmBtn').style.display = 'none';
                document.getElementById('dmCancelBtn').style.display = 'none';
                
                let container = document.getElementById('wheelContainer');
                if(container) container.style.transform = `rotate(${360 * 5 + Math.floor(Math.random()*360)}deg)`;
                
                setTimeout(() => {
                    let r = Math.random();
                    let resultTitle = "";
                    let resultMsg = "";
                    if (r < 0.1) { 
                        window.userData.balance += 1000;
                        resultTitle = "جائزة كبرى! &#x1F4B0;";
                        resultMsg = "ربحت $1000 دولار كاش!";
                        playSound('epic_match');
                    } else if (r < 0.3) { 
                        window.userData.level = (window.userData.level || 1) + 5;
                        resultTitle = "ترقية خرافية! &#x2B50;";
                        resultMsg = "تقدمت 5 مستويات دفعة واحدة!";
                        playSound('win');
                    } else if (r < 0.6) { 
                        window.userData.balance = Math.max(0, window.userData.balance - 100);
                        resultTitle = "حظ سيء! &#x1F480;";
                        resultMsg = "لقد خسرت $100 دولار!";
                        playSound('error');
                    } else { 
                        window.userData.balance += 1;
                        resultTitle = "حظ غريب! &#x1F602;";
                        resultMsg = "ربحت 1 دولار فقط ههههه!";
                        playSound('match');
                    }
                    
                    update(ref(db, `users/${window.currentUser}`), { balance: window.userData.balance, level: window.userData.level });
                    if(!window.battleMode) { 
                        scoreDisplay.innerHTML = `$${window.userData.balance}`; 
                        targetDisplay.innerHTML = window.userData.level;
                    }
                    
                    AppModal.show({title: resultTitle, html: resultMsg, confirmText: "حسناً &#x2705;"});
                }, 2000);
            }
        });
    };

    window.useUltimateStrike = function() {
        if(!window.battleMode && !window.isBotMatch && !window.battleEnded) return; 
        if(window.hasUsedSkill) return AppModal.alert("لقد استخدمت هذه المهارة مسبقاً في هذه المعركة!");
        if(window.userData.balance < 50) return AppModal.alert("رصيدك لا يكفي! (تحتاج $50)");
        
        window.hasUsedSkill = true;
        document.getElementById('ultimateBtn').disabled = true;
        
        window.userData.balance -= 50;
        update(ref(db, `users/${window.currentUser}`), { balance: window.userData.balance });
        
        currentLevelScore += 150; 
        playSound('epic_match');
        
        let destroyedCount = 0;
        let destroyedIndices = new Set();
        while(destroyedCount < 15) { 
            let r = Math.floor(Math.random() * (width*width));
            if(!destroyedIndices.has(r)) {
                destroyedIndices.add(r);
                if(squares[r]) squares[r].classList.add('fade-out');
                destroyedCount++;
            }
        }
        
        if(window.battleMode) { scoreDisplay.innerHTML = currentLevelScore; syncScoreToFirebase(); } 
        
        setTimeout(() => dropSequence(false), 300);
        showFloatingReward("&#x26A1; +150", destroyedIndices);
    };

    window.requestRematch = function(opponent, wager, isBotMatch) {
        AppModal.close(); 
        if (window.userData.balance < wager) return AppModal.alert("رصيدك لا يكفي للانتقام!");
        
        let tBal = window.usersList[opponent] ? (window.usersList[opponent].balance || 0) : 0;
        if(wager > tBal) return AppModal.alert("رصيد الخصم لا يكفي للانتقام!");

        if (isBotMatch) {
            let botFlag = '&#127757;'; 
            let botObj = window.botsData.find(b => b.name === opponent);
            if(botObj) botFlag = botObj.flag;
            challengeSelectedBot(opponent, wager, botFlag, true); 
        } else {
            executeChallengeRequest(opponent, wager);
        }
    };

    function checkSupportEligibility() {
        if(window.battleMode) {
            document.getElementById('supportBtn').style.display = 'none';
            return;
        }
        if(window.userData && window.userData.balance < 5) {
            document.getElementById('supportBtn').style.display = 'block';
        } else {
            document.getElementById('supportBtn').style.display = 'none';
        }
    }
    window.checkSupportEligibility = checkSupportEligibility;

    function claimSupport() {
        playSound('click');
        let now = Date.now();
        let lastSupport = window.userData.lastSupportTime || 0;
        let cooldown = 3 * 60 * 60 * 1000; 
        
        if (now - lastSupport < cooldown) {
            let remaining = cooldown - (now - lastSupport);
            let hours = Math.floor(remaining / (1000 * 60 * 60));
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            AppModal.alert(`عذراً! يجب الانتظار ${hours} ساعة و ${minutes} دقيقة لطلب الدعم مرة أخرى.`);
            return;
        }

        window.userData.lastSupportTime = now;
        window.userData.balance += 20;
        update(ref(db, `users/${window.currentUser}`), { 
            balance: window.userData.balance,
            lastSupportTime: now
        });
        
        checkSupportEligibility();
        if(!window.battleMode) { scoreDisplay.innerHTML = `$${window.userData.balance}`; }
        
        playSound('win');
        AppModal.show({
            title: "دعم الطوارئ وصل! &#x1F691;",
            html: `<div class="trophy-icon">&#x1F3C6;</div>
                   <h3 style="color:#66ff99; margin: 5px 0;">حصلت على 20$</h3>
                   <p>لقد عدت إلى المنافسة بقوة! نتمنى لك حظاً أوفر.</p>`,
            confirmText: "شكراً! &#x1F680;",
            confirmColor: "#00e676"
        });
    }
    window.claimSupport = claimSupport;

    async function fetchUserFlag() {
        try {
            let res = await fetch('https://get.geojs.io/v1/ip/country.json');
            let data = await res.json();
            let cc = data.country;
            if(cc) return getFlagEmoji(cc);
        } catch(e) {}
        return '&#127757;'; 
    }

    function checkLevelUpSequence(callback) {
        window.userData.battlesPlayed = (window.userData.battlesPlayed || 0) + 1;
        let leveledUp = (window.userData.battlesPlayed % 5 === 0);
        
        if (leveledUp) {
            window.userData.level = (window.userData.level || 1) + 1;
            level = window.userData.level;
        }
        
        update(ref(db, `users/${window.currentUser}`), { 
            battlesPlayed: window.userData.battlesPlayed,
            level: window.userData.level 
        }).catch(e=>console.log(e));

        if (leveledUp) {
            playSound('win');
            setTimeout(() => playSound('epic_match'), 500); 
            
            AppModal.show({
                title: "ترقية مستوى! &#x2B50;", 
                html: `<div style="position:relative; display:inline-block; margin:10px 0; animation: popSticker 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                          <div style="font-size:80px; text-shadow: 0 0 20px #ffd54f;">&#x2B50;</div>
                          <div style="position:absolute; top: 15px; left: 0; width: 100%; text-align: center; font-size: 28px; font-weight: 900; color: #fff; text-shadow: 2px 2px 4px #000;">${level}</div>
                       </div>
                       <h3 style="color:#66ff99; margin: 5px 0;">أحسنت!</h3>
                       <p>لقد ربحت <strong style="color:#66ff99">+$30</strong> كمكافأة.</p>`, 
                confirmText: "استمرار &#x27A1;", 
                confirmColor: "#00e676",
                onConfirm: callback
            });
        } else {
            callback();
        }
    }
    window.checkLevelUpSequence = checkLevelUpSequence;

    function showLoginScreen() {
        let savedUser = localStorage.getItem('candyUser');
        let savedPass = localStorage.getItem('candyPass');
        
        if (savedUser && savedPass) {
            AppModal.show({title: "جاري الدخول...", html: '<div class="wait-spinner"></div>', autoClose: false, showCancel: false});
            processLogin(savedUser, savedPass);
        } else {
            displayLoginModal();
        }
    }
    
    function displayLoginModal() {
        AppModal.show({
            title: "حلوى النجوم &#x1F31F;",
            html: `<div class="login-guide"><strong>كيف تبدأ اللعب؟</strong><br>1. اكتب <span>اسم مستخدم</span>.<br>2. اكتب <span>كلمة مرور</span>.<br>3. اضغط دخول.<br>&#x1F381; <span>هدية:</span> $100 للمبتدئين!</div>`,
            type: 'login', confirmText: "دخول / تسجيل حساب", autoClose: false,
            onConfirm: (user, pass) => {
                if (!user || !pass) { alert("يرجى كتابة اسم المستخدم وكلمة المرور أولاً!"); return; }
                if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
                AppModal.show({title: "جاري الدخول...", html: '<div class="wait-spinner"></div>', autoClose: false, showCancel: false});
                processLogin(user, pass);
            }
        });
    }

    async function processLogin(user, pass) {
        let myFlag = await fetchUserFlag();
        get(ref(db, `users/${user}`)).then((snap) => {
            if (snap.exists()) {
                let data = snap.val();
                if (data.banned) {
                    localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
                    return AppModal.alert("تم حظر هذا الحساب نهائياً من قبل الإدارة! &#x1F6AB;");
                }
                if (data.password === pass) { 
                    localStorage.setItem('candyUser', user); localStorage.setItem('candyPass', pass);
                    if(data.balance === undefined) data.balance = data.totalScore || 100;
                    if(data.battlesPlayed === undefined) data.battlesPlayed = 0;
                    if(data.lastSupportTime === undefined) data.lastSupportTime = 0;
                    if(data.soloGamesPlayed === undefined) data.soloGamesPlayed = 0;
                    if(data.lastSpinTime === undefined) data.lastSpinTime = 0;
                    if(data.lastGiftTime === undefined) data.lastGiftTime = 0;
                    
                    data.flag = getSafeFlag(data.flag || myFlag);
                    
                    update(ref(db, `users/${user}`), { flag: data.flag, isSearching: false, online: true }).catch(e=>console.log(e));
                    window.currentUser = user; window.userData = data; AppModal.close(); startGame(); 
                } else { 
                    localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
                    AppModal.alert("كلمة المرور خاطئة يا صديقي!"); 
                    displayLoginModal();
                }
            } else {
                localStorage.setItem('candyUser', user); localStorage.setItem('candyPass', pass);
                let newData = { password: pass, level: 1, balance: 100, battlesPlayed: 0, soloGamesPlayed: 0, online: true, banned: false, flag: myFlag, isSearching: false, lastSupportTime: 0, lastSpinTime: 0, lastGiftTime: 0 }; 
                set(ref(db, `users/${user}`), newData); window.currentUser = user; window.userData = newData; AppModal.close(); startGame();
            }
        }).catch(() => { displayLoginModal(); });
    }
    
    showLoginScreen();

    function logout() { 
        localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
        if(window.currentUser) set(ref(db, `users/${window.currentUser}/online`), false).then(() => location.reload());
        else location.reload(); 
    }
    window.logout = logout;

    setInterval(() => {
        if (!window.currentUser || !window.amIConnected || !window.usersList) return;
        if (Math.random() < 0.2) {
            let randomBot = window.botsData[Math.floor(Math.random() * window.botsData.length)];
            let bName = randomBot.name;
            if (window.usersList[bName]) {
                let currentBal = window.usersList[bName].balance || 500;
                let change = (Math.random() > 0.4 ? 1 : -1) * (10 + Math.floor(Math.random() * 50));
                let newBal = Math.max(100, currentBal + change); 
                update(ref(db, `users/${bName}`), { balance: newBal });
            }
        }
    }, 8000);

    function startRandomMatch() {
        playSound('click');
        let wager = 100;
        if(window.userData.balance < wager) return AppModal.alert("رصيدك لا يكفي! تحتاج إلى 100 دولار على الأقل للعب العشوائي.");
        
        executeRandomSearch(wager);
    }
    window.startRandomMatch = startRandomMatch;

    function executeRandomSearch(wager) {
        window.userData.isSearching = true;
        update(ref(db, `users/${window.currentUser}`), { isSearching: true, searchWager: wager });
        
        let pool = window.botsData.map(b => ({name: b.name, flag: b.flag}));
        Object.keys(window.usersList).forEach(p => {
            if(p !== window.currentUser) {
                pool.push({name: p, flag: getSafeFlag(window.usersList[p].flag)});
            }
        });

        AppModal.show({
            title: "جاري البحث...",
            html: `<p style="font-size:13px; color:#ddd;">نبحث عن لاعبين حقيقيين أولاً...</p>
                   <div id="rouletteBox" style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 10px; border: 2px solid #3498db; color: #fff;">
                    <span id="rFlag">&#x1F30D;</span> <span id="rName">نبحث...</span>
                   </div>`,
            showCancel: true, cancelText: "إلغاء البحث", autoClose: false,
            onCancel: () => {
                window.userData.isSearching = false;
                update(ref(db, `users/${window.currentUser}`), { isSearching: false, searchWager: null });
                if(window.rouletteInterval) clearInterval(window.rouletteInterval);
                if(window.rouletteTimeout) clearTimeout(window.rouletteTimeout);
            }
        });

        let rFlag = document.getElementById('rFlag');
        let rName = document.getElementById('rName');
        let rBox = document.getElementById('rouletteBox');
        
        window.rouletteInterval = setInterval(() => {
            let randUser = pool[Math.floor(Math.random() * pool.length)];
            if(rFlag && rName) {
                rFlag.innerHTML = getSafeFlag(randUser.flag);
                rName.innerText = randUser.name;
                playSound('tick');
            }
        }, 100);

        window.rouletteTimeout = setTimeout(() => {
            if(!window.userData.isSearching) return;
            clearInterval(window.rouletteInterval);
            
            let availableRealPlayers = Object.keys(window.usersList).filter(p => {
                let pd = window.usersList[p];
                return p !== window.currentUser && !pd.isBot && pd.online && pd.isSearching && pd.searchWager === wager && pd.balance >= wager;
            });
            
            let finalTarget;
            let isBotTarget = false;
            
            let validBots = window.botsData.filter(b => {
                let bBal = window.usersList[b.name] ? (window.usersList[b.name].balance || 0) : 0;
                return bBal >= wager;
            });

            if (availableRealPlayers.length > 0) {
                let targetPlayerName = availableRealPlayers[Math.floor(Math.random() * availableRealPlayers.length)];
                finalTarget = { name: targetPlayerName, flag: getSafeFlag(window.usersList[targetPlayerName].flag) };
            } else if (validBots.length > 0) {
                finalTarget = validBots[Math.floor(Math.random() * validBots.length)];
                isBotTarget = true;
            } else {
                finalTarget = window.botsData[Math.floor(Math.random() * window.botsData.length)];
                isBotTarget = true;
                update(ref(db, `users/${finalTarget.name}`), { balance: wager + 200 }); 
            }

            if(rFlag && rName && rBox) {
                rFlag.innerHTML = getSafeFlag(finalTarget.flag);
                rName.innerText = finalTarget.name;
                rBox.style.background = 'rgba(0, 230, 118, 0.3)';
                rBox.style.borderColor = '#00e676';
                rBox.style.transform = 'scale(1.05)';
                rBox.style.transition = 'all 0.3s ease';
            }
            
            playSound('epic_match');
            
            setTimeout(() => {
                AppModal.close();
                AppModal.show({
                    title: "تأكيد اللعب &#x2694;",
                    html: `المنافس: <strong>${getSafeFlag(finalTarget.flag)} ${finalTarget.name}</strong><br>الرهان: <strong style="color:#66ff99">$${wager}</strong>`,
                    showCancel: true, cancelText: "إلغاء &#x274C;", confirmText: "بدء &#x1F680;", confirmColor: '#00e676',
                    onConfirm: () => {
                        if(isBotTarget) {
                            challengeSelectedBot(finalTarget.name, wager, finalTarget.flag, true);
                        } else {
                            executeChallengeRequest(finalTarget.name, wager);
                        }
                    },
                    onCancel: () => {
                        window.userData.isSearching = false;
                        update(ref(db, `users/${window.currentUser}`), { isSearching: false, searchWager: null });
                    }
                });
            }, 1000);

        }, 3000); 
    }

    function challengeSelectedBot(botName, wager, botFlag, fromRandom = false) {
        botFlag = getSafeFlag(botFlag);
        
        let isABot = false;
        window.botsData.forEach(b => { if(b.name === botName) isABot = true; });

        if (isABot) {
            playSound('click');
            if(!fromRandom) {
                AppModal.showWait("جاري إرسال التحدي...", `في انتظار رد ${botName}`);
            }
            
            setTimeout(() => {
                let rejectChance = fromRandom ? 0 : 0.15;
                if (Math.random() < rejectChance) { 
                    AppModal.close();
                    playSound('error');
                    AppModal.show({
                        title: "مرفوض &#x1F6A8;", 
                        html: `لقد رفض <strong>${botName}</strong> طلب التحدي. يبدو أنه مشغول بمباراة أخرى الآن!`,
                        confirmText: "حسناً &#x2705;",
                        onConfirm: () => {
                            window.userData.isSearching = false;
                            update(ref(db, `users/${window.currentUser}`), { isSearching: false, searchWager: null });
                        }
                    });
                } else {
                    AppModal.close(); 
                    playSound('alert');
                    window.battleRole = 'challenger'; 
                    window.currentBattleWager = wager; 
                    window.opponentName = botName;
                    
                    window.botWillWin = Math.random() < 0.80;
                    
                    startBotBattle(wager, botName, botFlag);
                }
            }, fromRandom ? 500 : 1500 + Math.random() * 1500);
            return;
        }
        
        executeChallengeRequest(botName, wager);
    }
    window.challengeSelectedBot = challengeSelectedBot;

    function startGame() {
        document.getElementById('playerName').innerText = window.currentUser;
        document.getElementById('playerFlag').innerHTML = getSafeFlag(window.userData.flag);
        remove(ref(db, `users/${window.currentUser}/battle`)); 
        
        onValue(ref(db, '.info/connected'), (snap) => {
            window.amIConnected = snap.val() === true;
            if (window.amIConnected) {
                window.lastOpponentPingTime = Date.now();
                if(window.currentUser) {
                    const myOnlineRef = ref(db, `users/${window.currentUser}/online`);
                    onDisconnect(myOnlineRef).set(false).then(() => { set(myOnlineRef, true); });
                    onDisconnect(ref(db, `users/${window.currentUser}/isSearching`)).set(false);
                }
            }
        });

        onValue(ref(db, `users/${window.currentUser}/banned`), (snap) => {
            if(snap.exists() && snap.val() === true) {
                localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
                AppModal.show({
                    title: "تم حظرك! &#x1F6AB;",
                    html: "لقد تم حظرك من قبل الإدارة لمخالفة القوانين.",
                    confirmText: "خروج", autoClose: false,
                    onConfirm: () => { location.reload(); }
                });
                set(ref(db, `users/${window.currentUser}/online`), false);
            }
        });

        level = window.userData.level || 1; 
        listenToDatabase(); initLevel(); playSound('win');

        get(ref(db, `users/${window.currentUser}/pendingGift`)).then((snap) => {
            if(snap.exists()) {
                let gifts = snap.val(); let totalGifts = 0; let senders = [];
                Object.values(gifts).forEach(g => { totalGifts += g.amount; senders.push(g.from); });
                playSound('epic_match');
                AppModal.show({
                    title: "مفاجأة! هدايا لك أثناء غيابك &#x1F381;",
                    html: `المرسلون: <strong style="color:#9b59b6;">${[...new Set(senders)].join(' و ')}</strong><br>المبلغ الإجمالي: <strong style="color:#66ff99; font-size:24px;">$${totalGifts}</strong>!`,
                    confirmText: "رائع! استلام &#x1F911;", confirmColor: '#9b59b6',
                    onConfirm: () => { remove(ref(db, `users/${window.currentUser}/pendingGift`)); }
                });
            }
        });

        if(!window.botChallengeSent) {
            setTimeout(() => {
                if(!window.battleMode && !window.userData.isSearching) {
                    window.botChallengeSent = true;
                    let onlineBots = window.botsData.filter((b, idx) => ((idx + new Date().getHours()) % 2 === 0));
                    let randomBot = onlineBots[Math.floor(Math.random() * onlineBots.length)] || window.botsData[0];
                    
                    let botBal = window.usersList[randomBot.name] ? (window.usersList[randomBot.name].balance || 500) : 500;
                    let playerBal = window.userData.balance || 0;
                    let maxWager = Math.min(botBal, playerBal, 2000);
                    
                    let wagerOptions = [10, 50, 100, 200, 500, 750, 1000, 1500, 2000];
                    let validWagers = wagerOptions.filter(w => w <= maxWager);
                    let wager = validWagers.length > 0 ? validWagers[Math.floor(Math.random() * validWagers.length)] : 10;
                    
                    playSound('alert');
                    AppModal.show({
                        title: "تحدي جديد! &#x2694;",
                        html: `<strong style="color:#ff3366">${getSafeFlag(randomBot.flag)} ${randomBot.name}</strong> يتحداك على <strong style="color:#66ff99">$${wager}</strong>!`,
                        showCancel: true, confirmText: "قبول &#x2705;", cancelText: "رفض &#x274C;",
                        onConfirm: () => { 
                            if(window.userData.balance < wager) return AppModal.alert("رصيدك لا يكفي لقبول التحدي!");
                            AppModal.close(); playSound('alert'); 
                            window.battleRole = 'challenged'; window.currentBattleWager = wager; window.opponentName = randomBot.name;
                            
                            window.botWillWin = Math.random() < 0.80;
                            
                            startBotBattle(wager, randomBot.name, getSafeFlag(randomBot.flag));
                        },
                        onCancel: () => { AppModal.close(); }
                    });
                }
            }, 25000);
        }
    }

    window.updatePlayersDOM = function() {
        if(!window.usersList) return;
        let currentHour = new Date().getHours();
        let timeVar = Math.floor(Date.now() / 15000); 
        
        window.botsData.forEach((b, index) => {
            let isOnline = ((index + currentHour) % 2 === 0);
            let dynamicBalance = 550 + (((b.name.length * 23) + (index * 41) + (timeVar * 13)) % 3500);

            if(!window.usersList[b.name]) {
                window.usersList[b.name] = { balance: dynamicBalance, online: isOnline, flag: b.flag, isBot: true, banned: false, level: b.level };
            } else {
                window.usersList[b.name].online = isOnline;
                window.usersList[b.name].isBot = true;     
                window.usersList[b.name].flag = b.flag;    
                window.usersList[b.name].balance = dynamicBalance;
            }
        });

        let html = ''; 
        let sorted = Object.keys(window.usersList).sort((a,b) => (window.usersList[b].balance || 0) - (window.usersList[a].balance || 0));
        let myData = window.usersList[window.currentUser] || {};
        let myBlockedList = myData.blocked || {}; 

        sorted.forEach((p, rankIndex) => {
            let pData = window.usersList[p]; let isMe = (p === window.currentUser);
            let pBalance = pData.balance || pData.totalScore || 0; let isOnline = pData.online === true;
            let isBannedGlobally = pData.banned === true;
            let pFlag = getSafeFlag(pData.flag);
            
            let rankCrown = '';
            if(!isBannedGlobally) {
                if (rankIndex === 0) rankCrown = '&#x1F947; ';
                else if (rankIndex === 1) rankCrown = '&#x1F948; ';
                else if (rankIndex === 2) rankCrown = '&#x1F949; ';
            }

            let pLevel = pData.level || 1;
            let pTitle = pLevel > 50 ? '&#x1F409; أسطورة' : pLevel > 20 ? '&#x1F479; زعيم' : pLevel > 10 ? '&#x1F977; محترف' : '&#x1F476; مبتدئ';

            let theirBlockedList = pData.blocked || {};
            let iBlockedThem = myBlockedList[p] === true; 
            let theyBlockedMe = theirBlockedList[window.currentUser] === true; 

            if(isMe) { 
                window.userData.balance = pBalance; 
                window.userData.blocked = myBlockedList; 
                window.userData.lastSupportTime = pData.lastSupportTime || 0;
                window.userData.soloGamesPlayed = pData.soloGamesPlayed || 0;
                if(!window.battleMode) { 
                    scoreDisplay.innerHTML = `$${pBalance}`; 
                    scoreDisplay.className = "value money-color"; 
                } 
                checkSupportEligibility();
            }

            let dotClass = isOnline ? 'online' : 'offline';
            let actionBtns = '';

            if (isMe) {
                actionBtns = `<span style="color:#66ff99; font-size:12px;">أنت</span>`;
            } else if (isBannedGlobally) {
                actionBtns = `<span class="banned-text">ممنوع من اللعب</span>`;
            } else if (iBlockedThem) {
                actionBtns = `<div class="admin-controls"><button class="ban-btn" onclick="window.togglePersonalBan('${p}', true)" style="background:#2ecc71; color:#000;">فك الحظر الشخصي &#x2705;</button></div>`;
            } else if (theyBlockedMe && !pData.isBot) {
                actionBtns = `<span style="color:#777; font-size:12px;">غير متاح للتفاعل</span>`;
            } else {
                let btnChallenge = `<button class="challenge-btn" onclick="window.openWagerModal('${p}')">تحدي &#x2694;</button>`;
                let btnGift = `<button class="gift-btn" onclick="window.openGiftModal('${p}')">إهداء &#x1F381;</button>`;
                let btnPersonalBlock = `<button class="ban-btn" onclick="window.togglePersonalBan('${p}', false)">حظر شخصي &#x1F6AB;</button>`;
                actionBtns = `<div class="btn-group">${btnGift}${btnChallenge}</div><div class="admin-controls">${btnPersonalBlock}</div>`;
            }

            let adminBtns = '';
            if (window.currentUser === 'اسلام' && !isMe && !pData.isBot) {
                let globalBanText = isBannedGlobally ? "فك الحظر العام &#x2705;" : "حظر عام &#x1F6A8;";
                adminBtns = `<div class="admin-controls" style="background:rgba(231, 76, 60, 0.2); padding:5px; border-radius:5px; margin-top:5px;">
                    <button class="ban-btn" style="background:#e67e22;" onclick="window.toggleGlobalBan('${p}', ${isBannedGlobally})">${globalBanText}</button>
                    <button class="del-btn" onclick="window.deletePlayer('${p}')">حذف نهائي &#x1F5D1;</button>
                </div>`;
            }

            let pStatus = isBannedGlobally ? `<span class="banned-text">(حساب مغلق)</span>` : (iBlockedThem ? `<span style="color:#7f8c8d">(محظور من قبلك)</span>` : `الرصيد: $${pBalance}`);

            html += `<div class="player-row">
                        <div class="p-name">
                            <span class="p-name-text">${rankCrown}${pFlag} ${p}</span> 
                            <span class="status-dot ${dotClass}"></span>
                        </div>
                        <div><span class="p-title">${pTitle}</span></div>
                        <div class="p-score">${pStatus}</div>
                        ${actionBtns}
                        ${adminBtns}
                     </div>`;
        });
        
        let pList = document.getElementById('playersList');
        if(pList) {
            pList.innerHTML = html; filterPlayers(); 
        }
    }

    function setFilterTab(tab) {
        window.currentFilterTab = tab;
        document.getElementById('tabAll').classList.remove('active-tab');
        document.getElementById('tabOnline').classList.remove('active-tab');
        if(tab === 'all') document.getElementById('tabAll').classList.add('active-tab');
        else document.getElementById('tabOnline').classList.add('active-tab');
        filterPlayers();
    }
    window.setFilterTab = setFilterTab;

    function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); playSound('click'); }
    window.toggleSidebar = toggleSidebar;

    function filterPlayers() {
        let filter = document.getElementById('searchPlayerInput').value.toLowerCase();
        let rows = document.getElementById('playersList').getElementsByClassName('player-row');
        for (let i = 0; i < rows.length; i++) {
            let nameElement = rows[i].getElementsByClassName('p-name-text')[0];
            let statusElement = rows[i].getElementsByClassName('status-dot')[0];
            if (nameElement && statusElement) {
                let txtValue = nameElement.textContent || nameElement.innerText;
                let isOnline = statusElement.classList.contains('online');
                
                let matchesSearch = txtValue.toLowerCase().indexOf(filter) > -1;
                let matchesTab = window.currentFilterTab === 'all' || (window.currentFilterTab === 'online' && isOnline);
                
                rows[i].style.display = (matchesSearch && matchesTab) ? "" : "none";
            }
        }
    }
    window.filterPlayers = filterPlayers;

    function toggleChat() {
        const chatPanel = document.getElementById('chatPanel'); const chatBadge = document.getElementById('chatBadge');
        if(chatPanel.style.display === 'flex') { chatPanel.style.display = 'none'; } 
        else { chatPanel.style.display = 'flex'; document.getElementById('chatInput').focus(); chatBadge.style.display = 'none'; }
        playSound('click'); document.getElementById('chatPreviewBubble').classList.add('hidden');
    }
    window.toggleChat = toggleChat;

    function submitTextChat() {
        let input = document.getElementById('chatInput'); let txt = input.value.trim();
        if(txt !== '') { sendChat(txt, false); input.value = ''; }
    }
    window.submitTextChat = submitTextChat;

    function sendChat(text, isSticker) {
        if(!window.battleMode) return;
        if(window.isBotMatch) {
            renderChat({sender: window.currentUser, text: text, isSticker: isSticker});
            
            setTimeout(() => { 
                if(window.battleMode) { 
                    const stickers = ['&#x1F602;', '&#x1F621;', '&#x1F525;', '&#x1F631;', '&#x1F480;', '&#x1F60E;'];
                    let botReply = stickers[Math.floor(Math.random() * stickers.length)];
                    renderChat({sender: window.opponentName, text: botReply, isSticker: true}); 
                    playSound('msg_pop'); 
                    showChatPreview({sender: window.opponentName, text: botReply, isSticker: true}); 
                } 
            }, 1500 + Math.random() * 2000);
            return;
        }
        let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
        update(ref(db, targetBattlePath), { lastMessage: { id: Date.now()+Math.random(), sender: window.currentUser, text: text, isSticker: isSticker } }).catch(e=>console.log(e));
    }
    window.sendChat = sendChat;

    function renderChat(msg) {
        const chatBox = document.getElementById('chatMessages'); const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${msg.sender === window.currentUser ? 'me' : 'opp'} ${msg.isSticker ? 'sticker' : ''}`;
        msgDiv.innerHTML = msg.text; chatBox.appendChild(msgDiv); chatBox.scrollTop = chatBox.scrollHeight; 
    }

    function showChatPreview(msg) {
        const bubble = document.getElementById('chatPreviewBubble'); const badge = document.getElementById('chatBadge');
        badge.style.display = 'block';
        
        if (msg.isSticker) {
            bubble.innerHTML = `<div style="font-size:60px; animation: popSticker 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-shadow: 0 5px 15px rgba(0,0,0,0.6);">${msg.text}</div>`;
            bubble.style.background = 'transparent';
            bubble.style.border = 'none';
            bubble.style.boxShadow = 'none';
            bubble.style.bottom = '110px'; 
        } else {
            bubble.innerHTML = `<strong style="color:#ffd54f">${msg.sender}:</strong> ${msg.text}`;
            bubble.style.background = 'rgba(0, 0, 0, 0.85)';
            bubble.style.border = '2px solid #ffd54f';
            bubble.style.boxShadow = '0 5px 15px rgba(0,0,0,0.6)';
            bubble.style.bottom = '85px';
        }
        
        bubble.classList.remove('hidden');
        clearTimeout(previewTimeout); previewTimeout = setTimeout(() => { bubble.classList.add('hidden'); }, 3000);
    }
    window.showChatPreview = showChatPreview;

    function handleOpponentDisconnect() {
        if(!window.battleMode || window.isBotMatch) return;
        let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
        update(ref(db, targetBattlePath), { status: 'forfeited', disconnectedUser: window.opponentName }).catch(e=>console.log(e));
    }
    window.handleOpponentDisconnect = handleOpponentDisconnect;

    function handleForfeit(battle) {
        try {
            if(!window.battleMode) return;
            window.battleMode = false; window.isWaitingForOpponent = false; AppModal.close(); 
            
            if(window.battlePingInterval) clearInterval(window.battlePingInterval);
            if(window.battleMonitorInterval) clearInterval(window.battleMonitorInterval);
            if(window.disconnectRef) window.disconnectRef.cancel();

            if(battle.disconnectedUser === window.opponentName) {
                updateMyBalance(battle.wager);
                animateMoneyTransfer(true, battle.wager, () => {
                    AppModal.show({ title: "هروب الخصم! &#x1F3C3;", html: `لقد انقطع الاتصال بالخصم أثناء المعركة!<br>تم إعلان فوزك، وربحت <strong style="color:#66ff99">+$${battle.wager}</strong> دولار!`, confirmText: "عظيم!", onConfirm: resetToNormalMode });
                });
                
                get(ref(db, `users/${window.opponentName}`)).then(snap => {
                    if(snap.exists()) {
                        let oppBal = snap.val().balance || 0;
                        update(ref(db, `users/${window.opponentName}`), { balance: Math.max(0, oppBal - battle.wager) }).catch(e=>console.log(e));
                    }
                });
                
                let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
                setTimeout(() => { remove(ref(db, targetBattlePath)); }, 2000);
            } else {
                updateMyBalance(-battle.wager);
                animateMoneyTransfer(false, battle.wager, () => {
                    AppModal.show({ title: "لقد انسحبت &#x1F3F3;", html: `لقد انقطع اتصالك أو هربت، فخسرت <strong style="color:#ff3366">-$${battle.wager}</strong> دولار لصالح الخصم.`, confirmText: "متابعة", onConfirm: resetToNormalMode });
                });
            }
        } catch(e) { console.log(e); }
    }
    window.handleForfeit = handleForfeit;

    function toggleGlobalBan(targetPlayer, currentlyBanned) {
        let actionText = currentlyBanned ? "فك الحظر العام" : "حظر عام (نهائي)";
        AppModal.show({
            title: `${actionText} &#x26A0;`,
            html: `هل أنت متأكد من ${actionText} للاعب <strong>${targetPlayer}</strong>؟`,
            showCancel: true, confirmText: 'نعم', confirmColor: currentlyBanned ? '#00e676' : '#e74c3c',
            onConfirm: () => {
                update(ref(db, `users/${targetPlayer}`), { banned: !currentlyBanned });
                AppModal.alert(`تمت العملية بنجاح!`);
            }
        });
    }
    window.toggleGlobalBan = toggleGlobalBan;

    function deletePlayer(targetPlayer) {
        AppModal.show({
            title: "حذف حساب نهائي &#x1F5D1;",
            html: `هل أنت متأكد من مسح حساب <strong>${targetPlayer}</strong> بالكامل من اللعبة؟ (لا يمكن التراجع)`,
            showCancel: true, confirmText: 'نعم، احذف', confirmColor: '#c0392b',
            onConfirm: () => {
                remove(ref(db, `users/${targetPlayer}`));
                AppModal.alert("تم مسح اللاعب من قاعدة البيانات بنجاح!");
            }
        });
    }
    window.deletePlayer = deletePlayer;

    function togglePersonalBan(targetPlayer, currentlyBlocked) {
        if (currentlyBlocked) {
            remove(ref(db, `users/${window.currentUser}/blocked/${targetPlayer}`));
        } else {
            if (confirm(`هل أنت متأكد من حظر "${targetPlayer}" شخصياً؟ \nلن تراه في القائمة ولن يتمكن من إزعاجك بتحديات أو رسائل.`)) {
                set(ref(db, `users/${window.currentUser}/blocked/${targetPlayer}`), true);
            }
        }
    }
    window.togglePersonalBan = togglePersonalBan;

    function listenToDatabase() {
        onValue(ref(db, 'users'), (snap) => {
            if(snap.exists()) {
                window.usersList = snap.val() || {}; 
                window.updatePlayersDOM();
            }
        });

        if(window.domUpdateInterval) clearInterval(window.domUpdateInterval);
        window.domUpdateInterval = setInterval(() => {
            window.updatePlayersDOM();
        }, 15000);

        onValue(ref(db, `users/${window.currentUser}/liveGift`), (snap) => {
            if(snap.exists()) {
                let gift = snap.val(); playSound('win');
                AppModal.show({
                    title: "هدية جديدة وصلت! &#x1F381;",
                    html: `من: <strong style="color:#9b59b6; font-size:18px;">${gift.from}</strong><br>المبلغ: <strong style="color:#66ff99; font-size:22px;">$${gift.amount}</strong>!`,
                    confirmText: "رائع! شكراً &#x1F970;", confirmColor: '#9b59b6',
                    onConfirm: () => { remove(ref(db, `users/${window.currentUser}/liveGift`)); }
                });
            }
        });

        onValue(ref(db, `users/${window.currentUser}/battle`), (snap) => {
            if(!snap.exists()) {
                if(window.battleMode && window.battleRole === 'challenged' && !window.isBotMatch) {
                    AppModal.show({title: "انتهت المعركة", html: "تم إنهاء المعركة بنجاح.", confirmText: "حسناً &#x2705;", onConfirm: resetToNormalMode});
                }
                return;
            }
            
            let battle = snap.val();
            
            if(battle.status === 'pending' && battle.challenged === window.currentUser) {
                let myData = window.usersList[window.currentUser] || {};
                if (myData.blocked && myData.blocked[battle.challenger]) {
                    update(ref(db, `users/${window.currentUser}/battle`), { status: 'declined' });
                    return;
                }

                if (window.userData.isSearching) {
                    window.userData.isSearching = false;
                    update(ref(db, `users/${window.currentUser}`), { isSearching: false });
                }

                let oppData = window.usersList[battle.challenger] || {};
                let oppFlag = getSafeFlag(oppData.flag);

                playSound('alert');
                
                AppModal.show({
                    title: "تأكيد اللعب &#x2694;",
                    html: `المنافس: <strong style="color:#ff3366">${oppFlag} ${battle.challenger}</strong><br>الرهان: <strong style="color:#66ff99">$${battle.wager}</strong>`,
                    showCancel: true, confirmText: "بدء &#x1F680;", cancelText: "إلغاء &#x274C;",
                    onConfirm: () => { 
                        if(window.userData.balance < battle.wager) {
                            declineChallenge();
                            return AppModal.alert("رصيدك لا يكفي لقبول التحدي!");
                        }
                        acceptChallenge(battle.wager, battle.challenger); 
                    },
                    onCancel: () => { declineChallenge(); }
                });
            }

            if(window.battleMode && battle.status === 'accepted' && window.battleRole === 'challenged') { 
                targetDisplay.innerText = Math.max(0, battle.p1Score); 
                
                let myScore = battle.p2Score || 0;
                let oppScore = battle.p1Score || 0;

                if(battle.p2Done && !battle.p1Done && !window.isWaitingForOpponent) {
                    window.isWaitingForOpponent = true;
                    window.showDynamicWaitModal(myScore, oppScore, battle.challenger);
                } else if (window.isWaitingForOpponent && battle.p2Done && !battle.p1Done) {
                    window.updateWaitingScreen(myScore, oppScore, battle.challenger);
                } else if(battle.p1Done && battle.p2Done) {
                    window.isWaitingForOpponent = false;
                    evaluateBattleResult(battle);
                }
            }
            
            if(battle.status === 'forfeited' && window.battleMode && window.battleRole === 'challenged') {
                handleForfeit(battle);
            }

            if(window.battleMode && battle.lastMessage && battle.lastMessage.id !== window.lastMsgId) {
                window.lastMsgId = battle.lastMessage.id; renderChat(battle.lastMessage);
                if(battle.lastMessage.sender !== window.currentUser) {
                    playSound('msg_pop');
                    if(document.getElementById('chatPanel').style.display !== 'flex') showChatPreview(battle.lastMessage);
                }
            }
        });
    }

    function openGiftModal(targetPlayer) {
        playSound('click'); document.getElementById('sidebar').classList.remove('open');

        // التحقق من مرور 24 ساعة على آخر هدية
        let now = Date.now();
        let lastGift = window.userData.lastGiftTime || 0;
        let cooldown = 24 * 60 * 60 * 1000; // 24 ساعة
        
        if (now - lastGift < cooldown) {
            let remaining = cooldown - (now - lastGift);
            let hours = Math.floor(remaining / (1000 * 60 * 60));
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            return AppModal.alert(`عذراً! يمكنك إرسال هدية واحدة فقط كل 24 ساعة. يرجى المحاولة بعد ${hours} ساعة و ${minutes} دقيقة.`);
        }

        let targetFlag = getSafeFlag(window.usersList[targetPlayer] ? window.usersList[targetPlayer].flag : null);
        
        AppModal.show({
            title: "إرسال هدية &#x1F381;", html: `إلى صديقك: <strong style="color:#9b59b6;">${targetFlag} ${targetPlayer}</strong>`,
            type: 'prompt', placeholder: "المبلغ بالدولار", showCancel: true, confirmText: "إرسال &#x1F4B8;", confirmColor: '#9b59b6',
            onConfirm: (amount) => {
                amount = parseInt(amount);
                if(isNaN(amount) || amount <= 0) return AppModal.alert("الرجاء إدخال مبلغ صحيح!");
                if(amount > window.userData.balance) return AppModal.alert("رصيدك لا يكفي لإرسال هذه الهدية!");

                playSound('epic_match');
                
                // حساب عائد 10%
                let cashback = Math.floor(amount * 0.10);
                window.userData.balance = window.userData.balance - amount + cashback;
                window.userData.lastGiftTime = now; // تسجيل وقت الإرسال
                
                // تحديث الرصيد ووقت الهدية في قاعدة البيانات
                update(ref(db, `users/${window.currentUser}`), { 
                    balance: window.userData.balance,
                    lastGiftTime: now 
                });

                if (window.usersList[targetPlayer]) {
                    let isTargetOnline = window.usersList[targetPlayer].online === true;
                    let targetBalance = window.usersList[targetPlayer].balance || 0;
                    update(ref(db, `users/${targetPlayer}`), { balance: targetBalance + amount });
                    
                    if(!window.usersList[targetPlayer].isBot) {
                        if(isTargetOnline) { set(ref(db, `users/${targetPlayer}/liveGift`), { from: window.currentUser, amount: amount }); } 
                        else { set(ref(db, `users/${targetPlayer}/pendingGift/${Date.now()}`), { from: window.currentUser, amount: amount }); }
                    }
                }
                
                checkSupportEligibility();
                if(!window.battleMode) { scoreDisplay.innerHTML = `$${window.userData.balance}`; }

                playSound('win');
                AppModal.show({
                    title: "كرمك عاد إليك! &#x1F381;",
                    html: `<div class="trophy-icon">&#x1F4E6;</div>
                           <h3 style="color:#66ff99; margin: 5px 0;">استرداد 10%</h3>
                           <p>تم إرسال $${amount} إلى ${targetPlayer} بنجاح.<br>وعاد إليك <strong style="color:#ffd54f">+$${cashback}</strong> كمكافأة كرم!</p>`,
                    confirmText: "رائع! &#x1F970;"
                });
            }
        });
    }
    window.openGiftModal = openGiftModal;

    function openWagerModal(targetPlayer) {
        playSound('click'); document.getElementById('sidebar').classList.remove('open');
        let targetFlag = getSafeFlag(window.usersList[targetPlayer] ? window.usersList[targetPlayer].flag : null);
        AppModal.show({
            title: "تحدي المعركة &#x2694;", html: `الخصم: <strong style="color:#00e676;">${targetFlag} ${targetPlayer}</strong>`,
            type: 'prompt', placeholder: "مبلغ الرهان ($)", showCancel: true, confirmText: "أرسل التحدي &#x2694;",
            onConfirm: (wager) => {
                wager = parseInt(wager);
                let tBal = window.usersList[targetPlayer] ? (window.usersList[targetPlayer].balance || 0) : 0;
                if(isNaN(wager) || wager < 5) return AppModal.alert("أقل رهان 5 دولار!");
                if(wager > window.userData.balance) return AppModal.alert("رصيدك لا يكفي!");
                if(wager > tBal) return AppModal.alert("رصيد الخصم لا يكفي!");
                
                if(window.usersList[targetPlayer] && window.usersList[targetPlayer].isBot) {
                    challengeSelectedBot(targetPlayer, wager, targetFlag);
                    return;
                }

                if(!window.usersList[targetPlayer].online) {
                    AppModal.show({
                        title: 'تأكيد', html: "الخصم يظهر أنه <b>غير متصل</b> (نقطة رمادية). هل ترغب في الإرسال على أي حال؟",
                        showCancel: true, confirmText: 'نعم، أرسل', onConfirm: () => { executeChallengeRequest(targetPlayer, wager); }
                    });
                } else { executeChallengeRequest(targetPlayer, wager); }
            }
        });
    }
    window.openWagerModal = openWagerModal;

    function executeChallengeRequest(targetName, wager) {
        window.opponentName = targetName; window.battleRole = 'challenger'; window.currentBattleWager = wager;
        const targetBattleRef = ref(db, `users/${targetName}/battle`);
        
        get(targetBattleRef).then(snap => {
            if(snap.exists() && (snap.val().status === 'pending' || snap.val().status === 'accepted')) { return AppModal.alert("الخصم مشغول بتحدي آخر!"); }
            
            set(targetBattleRef, { challenger: window.currentUser, challenged: targetName, wager: wager, status: 'pending', p1Score: 0, p2Score: 0, p1Done: false, p2Done: false });

            if(window.unsubTargetBattle) window.unsubTargetBattle();
            window.unsubTargetBattle = onValue(targetBattleRef, (snapTarget) => {
                if(!snapTarget.exists()) {
                    if(window.battleMode && !window.isBotMatch) {
                        window.battleMode = false;
                        AppModal.show({title: "انتهت المعركة", html: "تم إنهاء المعركة بنجاح.", confirmText: "حسناً", onConfirm: resetToNormalMode});
                    }
                    return;
                }
                let battle = snapTarget.val();

                if(battle.status === 'accepted' && !window.battleMode) {
                    AppModal.close(); playSound('alert'); startBattleMode(battle.wager, battle.challenged);
                }
                if(battle.status === 'declined') {
                    AppModal.show({title: "مرفوض", html: "لقد رفض الخصم طلب التحدي."}); playSound('error'); 
                    resetToNormalMode(); window.unsubTargetBattle(); setTimeout(() => { remove(targetBattleRef); }, 1000);
                }
                if(window.battleMode && battle.status === 'accepted' && window.battleRole === 'challenger') { 
                    targetDisplay.innerText = Math.max(0, battle.p2Score); 
                    
                    let myScore = battle.p1Score || 0;
                    let oppScore = battle.p2Score || 0;

                    if(battle.p1Done && !battle.p2Done && !window.isWaitingForOpponent) {
                        window.isWaitingForOpponent = true;
                        window.showDynamicWaitModal(myScore, oppScore, targetName);
                    } else if (window.isWaitingForOpponent && battle.p1Done && !battle.p2Done) {
                        window.updateWaitingScreen(myScore, oppScore, targetName);
                    } else if(battle.p1Done && battle.p2Done) {
                        window.isWaitingForOpponent = false;
                        evaluateBattleResult(battle);
                    }
                }
                
                if(battle.status === 'forfeited' && window.battleMode && window.battleRole === 'challenger') {
                    handleForfeit(battle);
                }
                
                if(window.battleMode && battle.lastMessage && battle.lastMessage.id !== window.lastMsgId) {
                    window.lastMsgId = battle.lastMessage.id; renderChat(battle.lastMessage);
                    if(battle.lastMessage.sender !== window.currentUser) {
                        playSound('msg_pop');
                        if(document.getElementById('chatPanel').style.display !== 'flex') showChatPreview(battle.lastMessage);
                    }
                }
            });
            AppModal.showWait("جاري إرسال التحدي...", `في انتظار رد ${targetName}`);
        });
    }

    function acceptChallenge(wager, challenger) {
        playSound('click'); window.battleRole = 'challenged'; window.currentBattleWager = wager; window.opponentName = challenger;
        update(ref(db, `users/${window.currentUser}/battle`), { status: 'accepted' });
        playSound('alert'); startBattleMode(wager, challenger);
    }
    window.acceptChallenge = acceptChallenge;

    function declineChallenge() {
        playSound('error'); update(ref(db, `users/${window.currentUser}/battle`), { status: 'declined' });
        setTimeout(() => { remove(ref(db, `users/${window.currentUser}/battle`)); }, 2000);
    }
    window.declineChallenge = declineChallenge;

    function surrenderBattle() {
        try {
            if(!window.battleMode) return; playSound('error');
            AppModal.show({
                title: "تأكيد الانسحاب &#x26A0;", html: `هل أنت متأكد؟ سيتم خصم <strong style="color:#ff3366">$${window.currentBattleWager}</strong> من رصيدك كعقوبة!`,
                showCancel: true, confirmText: 'نعم، أنسحب', confirmColor: '#ff4d4d', onConfirm: () => {
                    if (window.isBotMatch) {
                        if(window.botInterval) clearTimeout(window.botInterval); 
                        window.battleMode = false; window.isBotMatch = false; window.battleEnded = true;
                        
                        let botData = window.usersList[window.opponentName];
                        if (botData) {
                            update(ref(db, `users/${window.opponentName}`), { balance: (botData.balance || 0) + window.currentBattleWager });
                        }

                        updateMyBalance(-window.currentBattleWager); 
                        animateMoneyTransfer(false, window.currentBattleWager, () => { resetToNormalMode(); });
                    } else {
                        let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
                        update(ref(db, targetBattlePath), { status: 'forfeited', disconnectedUser: window.currentUser }).catch(e=>console.log(e));
                    }
                }
            });
        } catch(e) { console.log(e); }
    }
    window.surrenderBattle = surrenderBattle;

    function startBotBattle(wager, botName, botFlag) {
        window.userData.isSearching = false; update(ref(db, `users/${window.currentUser}`), { isSearching: false, searchWager: null });
        window.battleEnded = false; window.battleMode = true; window.isBotMatch = true; window.lastMsgId = 0; window.isWaitingForOpponent = false; 
        
        window.botDone = false; window.playerDone = false; window.botScore = 0; window.botMoves = 25;
        window.botWillWin = Math.random() < 0.80;

        document.getElementById('chatMessages').innerHTML = ''; document.getElementById('chatPreviewBubble').classList.add('hidden'); document.getElementById('chatBadge').style.display = 'none';
        moves = 25; currentLevelScore = 0; window.currentBattleWager = wager; window.opponentName = botName;

        document.getElementById('wagerBox').style.display = 'block'; document.getElementById('wagerDisplay').innerText = `$${wager}`;
        scoreLabel.innerText = "نقاطك"; scoreDisplay.innerHTML = "0"; scoreDisplay.className = "value"; 
        targetLabel.innerHTML = `${getSafeFlag(botFlag)} ${botName}`; targetDisplay.innerText = "0"; targetDisplay.classList.add('vs-mode'); movesDisplay.innerHTML = moves;
        
        document.getElementById('menuBtn').style.display = 'none'; document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('spinBtn').style.display = 'none';
        document.getElementById('surrenderBtn').style.display = 'block'; document.getElementById('chatBtn').style.display = 'block'; 
        
        window.hasUsedSkill = false;
        let ultBtn = document.getElementById('ultimateBtn');
        if(ultBtn) ultBtn.disabled = false;
        document.getElementById('skillBar').style.display = 'flex'; 
        checkSupportEligibility(); 

        if(window.botInterval) clearTimeout(window.botInterval);

        function botPlayNextMove() {
            if(!window.battleMode || !window.isBotMatch) return;
            
            if (window.botMoves > 0) {
                window.botMoves--;
                
                let playerMovesTaken = 25 - moves;
                let botMovesTaken = 25 - window.botMoves;

                let targetBotScore;
                if (window.botWillWin) {
                    targetBotScore = currentLevelScore + 20 + Math.random() * 30; 
                } else {
                    targetBotScore = currentLevelScore - 20 - Math.random() * 30;
                }
                
                let diff = targetBotScore - window.botScore;
                
                let pointsToAdd = 0;
                if (diff > 0) {
                    pointsToAdd = Math.floor(diff / Math.max(window.botMoves, 1)) + Math.floor(Math.random() * 10);
                } else {
                    pointsToAdd = Math.floor(Math.random() * 5);
                }
                
                window.botScore += Math.max(pointsToAdd, 1); 
                targetDisplay.innerText = window.botScore;
                
                if (window.playerDone) {
                    window.updateWaitingScreen(currentLevelScore, window.botScore, botName);
                }

                if (window.botMoves === 12) { 
                    const midStickers = ['&#x1F608;', '&#x1F525;', '&#x1F4A5;', '&#x1F60E;', '&#x1F480;']; 
                    let s = midStickers[Math.floor(Math.random() * midStickers.length)];
                    renderChat({sender: botName, text: s, isSticker: true}); 
                    playSound('msg_pop'); 
                    showChatPreview({sender: botName, text: s, isSticker: true});
                }

                if (window.botMoves <= 0) {
                    window.botDone = true;
                    if (window.playerDone) {
                        AppModal.close();
                        setTimeout(() => evaluateBotBattleResult(), 500);
                    }
                } else {
                    let nextMoveTime = 1500;
                    if (botMovesTaken > playerMovesTaken + 2) {
                        nextMoveTime = 2500 + Math.random() * 2000; 
                    } else if (botMovesTaken < playerMovesTaken - 1) {
                        nextMoveTime = 500 + Math.random() * 500; 
                    } else {
                        nextMoveTime = 1200 + Math.random() * 1000; 
                    }
                    window.botInterval = setTimeout(botPlayNextMove, nextMoveTime);
                }
            }
        }
        
        window.botInterval = setTimeout(botPlayNextMove, 1500);
        createBoard();
    }
    window.startBotBattle = startBotBattle;

    function startBattleMode(wager, opponent) {
        window.userData.isSearching = false; 
        update(ref(db, `users/${window.currentUser}`), { isSearching: false });

        window.battleEnded = false; window.battleMode = true; window.lastMsgId = 0; window.isWaitingForOpponent = false; document.getElementById('chatMessages').innerHTML = ''; 
        document.getElementById('chatPreviewBubble').classList.add('hidden'); document.getElementById('chatBadge').style.display = 'none';
        moves = 25; currentLevelScore = 0; 
        
        document.getElementById('wagerBox').style.display = 'block';
        document.getElementById('wagerDisplay').innerText = `$${wager}`;

        scoreLabel.innerText = "نقاطك"; scoreDisplay.innerHTML = "0"; scoreDisplay.className = "value"; 
        let oppFlag = getSafeFlag(window.usersList[opponent] ? window.usersList[opponent].flag : null);
        targetLabel.innerHTML = `${oppFlag} ${opponent}`; 
        targetDisplay.innerText = "0"; targetDisplay.classList.add('vs-mode'); movesDisplay.innerHTML = moves;
        
        document.getElementById('menuBtn').style.display = 'none'; document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('spinBtn').style.display = 'none';
        document.getElementById('surrenderBtn').style.display = 'block'; document.getElementById('chatBtn').style.display = 'block'; 
        
        window.hasUsedSkill = false;
        let ultBtn = document.getElementById('ultimateBtn');
        if(ultBtn) ultBtn.disabled = false;
        document.getElementById('skillBar').style.display = 'flex'; 
        checkSupportEligibility(); 

        if(window.battlePingInterval) clearInterval(window.battlePingInterval);
        if(window.battleMonitorInterval) clearInterval(window.battleMonitorInterval);

        window.battlePingInterval = setInterval(() => {
            if(window.amIConnected) { update(ref(db, `users/${window.currentUser}`), { battlePing: Date.now() }); }
        }, 3000);

        window.lastOpponentPingTime = Date.now(); window.lastOpponentPingValue = null;

        window.battleMonitorInterval = setInterval(() => {
            if(!window.battleMode || !window.opponentName) return;
            if(!window.amIConnected) { window.lastOpponentPingTime = Date.now(); return; } 
            
            let oppData = window.usersList[window.opponentName];
            if(oppData) {
                if(oppData.battlePing !== window.lastOpponentPingValue) {
                    window.lastOpponentPingValue = oppData.battlePing; window.lastOpponentPingTime = Date.now();
                } else {
                    if(Date.now() - window.lastOpponentPingTime > 12000) { handleOpponentDisconnect(); }
                }
            }
        }, 2000);

        let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
        window.disconnectRef = onDisconnect(ref(db, targetBattlePath)); window.disconnectRef.update({ status: 'forfeited', disconnectedUser: window.currentUser });
        createBoard();
    }

    function syncScoreToFirebase() {
        if(!window.battleMode) return;
        let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
        update(ref(db, targetBattlePath), window.battleRole === 'challenger' ? { p1Score: currentLevelScore } : { p2Score: currentLevelScore }).catch(e=>console.log(e));
    }

    function endBattleMode() {
        try {
            if (window.battleEnded) return;
            window.battleEnded = true;

            if (window.isBotMatch) {
                window.playerDone = true;
                if (!window.botDone) {
                    window.isWaitingForOpponent = true;
                    window.showDynamicWaitModal(currentLevelScore, window.botScore, window.opponentName);
                } else {
                    setTimeout(() => evaluateBotBattleResult(), 500);
                }
            } else {
                syncScoreToFirebase();
                let targetBattlePath = `users/${window.battleRole === 'challenged' ? window.currentUser : window.opponentName}/battle`;
                update(ref(db, targetBattlePath), window.battleRole === 'challenger' ? { p1Done: true } : { p2Done: true }).catch(e=>console.log(e));
            }
        } catch (e) { console.log(e); }
    }
    window.endBattleMode = endBattleMode;

    function evaluateBotBattleResult() {
        window.battleMode = false; window.isBotMatch = false; window.isWaitingForOpponent = false; AppModal.close();
        let myScore = currentLevelScore; let oppScore = window.botScore;
        let won = myScore > oppScore; let draw = myScore === oppScore;

        if (draw) { 
            playSound('error'); 
            AppModal.show({title: "تعادل! &#x1F91D;", html: `كلاكما جمع <strong>${myScore}</strong> نقطة.<br>عادت دولارات الرهان سالمة.`, onConfirm: () => resetToNormalMode()});
        } else if (won) { 
            updateMyBalance(window.currentBattleWager); 
            
            let botData = window.usersList[window.opponentName];
            if (botData) { update(ref(db, `users/${window.opponentName}`), { balance: Math.max(0, (botData.balance || 0) - window.currentBattleWager) }); }

            animateMoneyTransfer(true, window.currentBattleWager, () => {
                AppModal.show({title: "انتصار ساحق! &#x1F3C6;", html: `نقاطك: <strong>${myScore}</strong> | ${window.opponentName}: <strong>${oppScore}</strong><br>ربحت <strong style="color:#66ff99">+$${window.currentBattleWager}</strong> دولار!`, confirmText: "عظيم!", onConfirm: () => resetToNormalMode()});
            });
        } else { 
            updateMyBalance(-window.currentBattleWager); 
            
            let botData = window.usersList[window.opponentName];
            if (botData) { update(ref(db, `users/${window.opponentName}`), { balance: (botData.balance || 0) + window.currentBattleWager }); }

            animateMoneyTransfer(false, window.currentBattleWager, () => {
                let rematchHtml = `<br><br><button onclick="window.requestRematch('${window.opponentName}', ${window.currentBattleWager * 2}, true)" style="background:#ff3366; color:white; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer; width:100%;">طلب انتقام بـ $${window.currentBattleWager * 2} &#x1F525;</button>`;
                AppModal.show({title: "لقد خسرت &#x1F494;", html: `نقاطك: <strong>${myScore}</strong> | ${window.opponentName}: <strong>${oppScore}</strong><br>خسرت <strong style="color:#ff3366">-$${window.currentBattleWager}</strong> دولار.${rematchHtml}`, confirmText: "حسناً", onConfirm: () => resetToNormalMode()}); 
            });
        }
    }

    function evaluateBattleResult(battle) {
        if(!window.battleMode) return;
        window.battleMode = false; window.isWaitingForOpponent = false; AppModal.close();
        
        if(window.battlePingInterval) clearInterval(window.battlePingInterval);
        if(window.battleMonitorInterval) clearInterval(window.battleMonitorInterval);
        if(window.disconnectRef) window.disconnectRef.cancel(); 

        let myScore = window.battleRole === 'challenger' ? battle.p1Score : battle.p2Score;
        let oppScore = window.battleRole === 'challenger' ? battle.p2Score : battle.p1Score;
        let won = myScore > oppScore; let draw = myScore === oppScore;

        if (draw) {
            playSound('error'); 
            AppModal.show({title: "تعادل! &#x1F91D;", html: `كلاكما جمع <strong>${myScore}</strong> نقطة.<br>عادت دولارات الرهان سالمة.`, onConfirm: () => resetToNormalMode()});
        } else if (won) {
            updateMyBalance(battle.wager);
            animateMoneyTransfer(true, battle.wager, () => {
                AppModal.show({title: "انتصار ساحق! &#x1F3C6;", html: `نقاطك: <strong>${myScore}</strong> | الخصم: <strong>${oppScore}</strong><br>ربحت <strong style="color:#66ff99">+$${battle.wager}</strong> دولار!`, confirmText: "عظيم!", onConfirm: () => resetToNormalMode()});
            });
        } else {
            updateMyBalance(-battle.wager);
            animateMoneyTransfer(false, battle.wager, () => {
                let rematchHtml = `<br><br><button onclick="window.requestRematch('${window.opponentName}', ${battle.wager * 2}, false)" style="background:#ff3366; color:white; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer; width:100%;">طلب انتقام بـ $${battle.wager * 2} &#x1F525;</button>`;
                AppModal.show({title: "لقد خسرت &#x1F494;", html: `نقاطك: <strong>${myScore}</strong> | الخصم: <strong>${oppScore}</strong><br>خسرت <strong style="color:#ff3366">-$${battle.wager}</strong> دولار.${rematchHtml}`, confirmText: "حسناً", onConfirm: () => resetToNormalMode()});
            });
        }
        if(window.unsubTargetBattle) window.unsubTargetBattle();
        if(window.battleRole === 'challenged') setTimeout(() => { remove(ref(db, `users/${window.currentUser}/battle`)); }, 3000);
    }
    window.evaluateBattleResult = evaluateBattleResult;

    function updateMyBalance(amount) { 
        window.userData.balance += amount; 
        if(window.userData.balance < 0) window.userData.balance = 0; 
        update(ref(db, `users/${window.currentUser}`), { balance: window.userData.balance }).catch(e=>console.log(e)); 
        checkSupportEligibility();
        if(!window.battleMode) { scoreDisplay.innerHTML = `$${window.userData.balance}`; }
    }
    
    function resetToNormalMode() {
        window.battleMode = false; window.battleRole = null; window.isWaitingForOpponent = false; window.userData.isSearching = false; window.isBotMatch = false; window.battleEnded = false;
        update(ref(db, `users/${window.currentUser}`), { isSearching: false }).catch(e=>console.log(e));
        if(window.botInterval) clearTimeout(window.botInterval);
        if(window.battlePingInterval) clearInterval(window.battlePingInterval);
        if(window.battleMonitorInterval) clearInterval(window.battleMonitorInterval);
        if(window.rouletteInterval) clearInterval(window.rouletteInterval);
        if(window.rouletteTimeout) clearTimeout(window.rouletteTimeout);
        
        document.getElementById('menuBtn').style.display = 'block'; document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('spinBtn').style.display = 'block';
        document.getElementById('surrenderBtn').style.display = 'none'; document.getElementById('chatBtn').style.display = 'none'; document.getElementById('chatPanel').style.display = 'none';
        document.getElementById('chatPreviewBubble').classList.add('hidden'); document.getElementById('chatBadge').style.display = 'none';
        document.getElementById('wagerBox').style.display = 'none';
        document.getElementById('skillBar').style.display = 'none';

        scoreLabel.innerText = "الرصيد"; targetLabel.innerText = "المستوى"; scoreDisplay.innerHTML = `$${window.userData.balance}`; scoreDisplay.className = "value money-color"; targetDisplay.classList.remove('vs-mode'); 
        
        checkSupportEligibility(); 
        initLevel();
    }
    window.resetToNormalMode = resetToNormalMode;

    const candyIcons = ["url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g1' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%23ff9999'/%3E%3Cstop offset='100%25' stop-color='%23cc0000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23g1)'/%3E%3C/svg%3E\")","url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2366ccff'/%3E%3Cstop offset='100%25' stop-color='%230055cc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='50,5 95,50 50,95 5,50' fill='url(%23g2)'/%3E%3C/svg%3E\")","url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g3' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%2366ff99'/%3E%3Cstop offset='100%25' stop-color='%2300802b'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect x='10' y='10' width='80' height='80' rx='20' fill='url(%23g3)'/%3E%3C/svg%3E\")","url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g4' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%23ffffcc'/%3E%3Cstop offset='100%25' stop-color='%23cc9900'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpolygon points='50,5 64,35 97,35 69,57 80,90 50,72 20,90 31,57 3,35 36,35' fill='url(%23g4)'/%3E%3C/svg%3E\")","url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23e699ff'/%3E%3Cstop offset='100%25' stop-color='%23660099'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='25,5 75,5 95,50 75,95 25,95 5,50' fill='url(%23g5)'/%3E%3C/svg%3E\")"];

    function initLevel() { window.battleEnded = false; moves = 25; currentLevelScore = 0; movesDisplay.innerHTML = moves; if(!window.battleMode) { targetDisplay.innerHTML = level; scoreDisplay.innerHTML = `$${window.userData.balance}`; } createBoard(); }

    let dragStartX = 0, dragStartY = 0, dragStartIndex = null;

    function handleInputStart(e) {
        if (moves <= 0 || isAnimating) return;
        dragStartIndex = parseInt(e.target.id);
        if (e.type.includes('touch')) { dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY; } 
        else { dragStartX = e.clientX; dragStartY = e.clientY; }
    }

    function handleInputEnd(e) {
        if (moves <= 0 || isAnimating || dragStartIndex === null) return;
        let endX, endY;
        if (e.type.includes('touch')) { endX = e.changedTouches[0].clientX; endY = e.changedTouches[0].clientY; } 
        else { endX = e.clientX; endY = e.clientY; }
        
        let diffX = endX - dragStartX; let diffY = endY - dragStartY;
        
        if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
            let targetIndex = dragStartIndex;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0 && dragStartIndex % width !== width - 1) targetIndex += 1; 
                else if (diffX < 0 && dragStartIndex % width !== 0) targetIndex -= 1; 
            } else {
                if (diffY > 0 && dragStartIndex < width * (width - 1)) targetIndex += width; 
                else if (diffY < 0 && dragStartIndex >= width) targetIndex -= width; 
            }
            if (targetIndex !== dragStartIndex) { attemptSwap(dragStartIndex, targetIndex); }
        } else {
            if (selectedSquare === null) { selectedSquare = dragStartIndex; squares[dragStartIndex].classList.add('selected'); playSound('click'); } 
            else {
                let i1 = selectedSquare; let i2 = dragStartIndex; squares[i1].classList.remove('selected'); selectedSquare = null;
                if (i1 !== i2) { attemptSwap(i1, i2); }
            }
        }
        dragStartIndex = null;
    }

    function attemptSwap(i1, i2) {
        if (Math.abs((i1%width)-(i2%width)) + Math.abs(Math.floor(i1/width)-Math.floor(i2/width)) === 1) {
            swap(i1, i2); isAnimating = true; playSound('click');
            if(selectedSquare !== null) { squares[selectedSquare].classList.remove('selected'); selectedSquare = null; }
            setTimeout(() => {
                if (!checkMatches()) { playSound('error'); swap(i1, i2); isAnimating = false; } 
                else { moves--; movesDisplay.innerHTML = moves; dropSequence(); }
            }, 250);
        } else {
            if(selectedSquare !== null) { squares[selectedSquare].classList.remove('selected'); selectedSquare = null; }
        }
    }

    function createBoard() {
        grid.innerHTML = ''; squares = []; boardTypes = new Array(width * width).fill(-1);
        for (let i = 0; i < width * width; i++) {
            const sq = document.createElement('div'); sq.setAttribute('id', i);
            let randomIdx = Math.floor(Math.random() * candyIcons.length);
            sq.style.backgroundImage = candyIcons[randomIdx];
            boardTypes[i] = randomIdx;
            
            sq.addEventListener('touchstart', handleInputStart, {passive: false});
            sq.addEventListener('touchend', handleInputEnd);
            sq.addEventListener('mousedown', handleInputStart);
            sq.addEventListener('mouseup', handleInputEnd);
            
            grid.appendChild(sq); squares.push(sq);
        }
        setTimeout(() => { checkAllMatches(false, true); }, 100);
    }
    
    function swap(i1, i2) { 
        const tBg = squares[i1].style.backgroundImage; 
        const tType = boardTypes[i1];
        squares[i1].style.backgroundImage = squares[i2].style.backgroundImage; 
        boardTypes[i1] = boardTypes[i2];
        squares[i2].style.backgroundImage = tBg; 
        boardTypes[i2] = tType;
    }

    function showFloatingReward(text, matchedSet) {
        let firstElementId = Array.from(matchedSet)[0];
        let square = document.getElementById(firstElementId);
        if(!square) return;

        let floatEl = document.createElement('div');
        floatEl.className = 'floating-reward';
        floatEl.innerHTML = text;
        
        floatEl.style.left = square.offsetLeft + 'px';
        floatEl.style.top = square.offsetTop + 'px';
        
        document.getElementById('grid').appendChild(floatEl);

        setTimeout(() => {
            if(floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
        }, 1000);
    }

    function checkMatches(isInit = false) {
        let matched = new Set();
        for (let r = 0; r < width; r++) { 
            for (let c = 0; c < width - 2; c++) { 
                let i = r*width+c; let m = [i, i+1, i+2]; 
                let type = boardTypes[i]; 
                if (type !== -1 && m.every(x => boardTypes[x] === type)) m.forEach(x => matched.add(x)); 
            } 
        }
        for (let c = 0; c < width; c++) { 
            for (let r = 0; r < width - 2; r++) { 
                let i = r*width+c; let m = [i, i+width, i+2*width]; 
                let type = boardTypes[i]; 
                if (type !== -1 && m.every(x => boardTypes[x] === type)) m.forEach(x => matched.add(x)); 
            } 
        }
        
        if (matched.size > 0) {
            if (!isInit) { 
                currentLevelScore += matched.size * 10; 
                
                if(matched.size >= 4) {
                    playSound('epic_match');
                    window.userData.balance += 5;
                    update(ref(db, `users/${window.currentUser}`), { balance: window.userData.balance });
                    checkSupportEligibility();
                    if(!window.battleMode) { scoreDisplay.innerHTML = `$${window.userData.balance}`; }
                    showFloatingReward("+$5", matched); 
                } else {
                    playSound('match');
                }
                
                if(window.battleMode) { scoreDisplay.innerHTML = currentLevelScore; syncScoreToFirebase(); } 
            }
            matched.forEach(x => squares[x].classList.add('fade-out')); return true;
        } return false;
    }

    function dropSequence(isInit = false) {
        setTimeout(() => {
            squares.forEach((sq, idx) => { 
                if(sq.classList.contains('fade-out')) { 
                    sq.style.backgroundImage = ''; 
                    boardTypes[idx] = -1;
                    sq.classList.remove('fade-out'); 
                } 
            });
            for (let c = 0; c < width; c++) { 
                let eRow = width - 1; 
                for (let r = width - 1; r >= 0; r--) { 
                    let i = r * width + c; 
                    if (boardTypes[i] !== -1) { 
                        if (r !== eRow) { 
                            let targetIdx = eRow * width + c;
                            squares[targetIdx].style.backgroundImage = squares[i].style.backgroundImage; 
                            boardTypes[targetIdx] = boardTypes[i];
                            
                            squares[i].style.backgroundImage = ''; 
                            boardTypes[i] = -1;
                        } 
                        eRow--; 
                    } 
                }
                for (let r = eRow; r >= 0; r--) { 
                    let i = r * width + c; 
                    let randomIdx = Math.floor(Math.random() * candyIcons.length);
                    squares[i].style.backgroundImage = candyIcons[randomIdx]; 
                    boardTypes[i] = randomIdx;
                    squares[i].classList.add('new-candy'); 
                    setTimeout(() => squares[i].classList.remove('new-candy'), 400); 
                } 
            }
            setTimeout(() => { checkAllMatches(isInit); }, 400);
        }, 200);
    }

    function checkAllMatches(isInit = false) {
        if (checkMatches(isInit)) dropSequence(isInit);
        else { 
            isAnimating = false; 
            if (!isInit && moves <= 0) {
                if(window.battleMode) {
                    endBattleMode(); 
                } else {
                    if(window.battleEnded) return; window.battleEnded = true;
                    
                    window.userData.soloGamesPlayed = (window.userData.soloGamesPlayed || 0) + 1;
                    update(ref(db, `users/${window.currentUser}`), { soloGamesPlayed: window.userData.soloGamesPlayed });
                    
                    if (window.userData.soloGamesPlayed % 5 === 0) {
                        playSound('win'); level++; window.userData.level = level; window.userData.balance += 30; 
                        update(ref(db, `users/${window.currentUser}`), { balance: window.userData.balance, level: level }).catch(e=>console.log(e));
                        AppModal.show({
                            title: "مستوى جديد! &#x2B50;", 
                            html: `<div style="position:relative; display:inline-block; margin:10px 0; animation: popSticker 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                                      <div style="font-size:80px; text-shadow: 0 0 20px #ffd54f;">&#x2B50;</div>
                                      <div style="position:absolute; top: 15px; left: 0; width: 100%; text-align: center; font-size: 28px; font-weight: 900; color: #fff; text-shadow: 2px 2px 4px #000;">${level}</div>
                                   </div>
                                   <h3 style="color:#66ff99; margin: 5px 0;">أحسنت!</h3>
                                   <p>لقد ربحت <strong style="color:#66ff99">+$30</strong> كمكافأة.</p>`, 
                            confirmText: "استمر &#x27A1;", 
                            onConfirm: initLevel
                        });
                    } else {
                        let gamesLeft = 5 - (window.userData.soloGamesPlayed % 5);
                        playSound('match');
                        window.userData.balance += 5;
                        update(ref(db, `users/${window.currentUser}`), { balance: window.userData.balance });
                        scoreDisplay.innerHTML = `$${window.userData.balance}`;
                        
                        AppModal.show({
                            title: "انتهت اللعبة! &#x1F389;",
                            html: `<h3 style="color:#ffd54f; margin: 5px 0;">النقاط: ${currentLevelScore}</h3>
                                   <p>العب <strong style="color:#ff3366">${gamesLeft}</strong> مباريات إضافية للوصول للمستوى التالي!</p>
                                   <p style="font-size:13px; color:#66ff99;">مكافأة اللعب: +$5</p>`,
                            confirmText: "لعب مجدداً &#x1F501;",
                            onConfirm: initLevel
                        });
                    }
                }
            } 
        }
    }
</script>
