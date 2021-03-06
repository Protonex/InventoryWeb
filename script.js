var cachePortalData ={};
var xhr;
function generatePortalInfoContent(data){
		var wrapp = $('<div>').addClass('portal_details');
		var level = $('<span>').addClass("level_"+data.level).addClass('portal_level').html("L"+data.level);
		
		var energyWrapp = $('<div>').addClass('energyWrapp');
		var energyMax = $('<div>').addClass('energyMax');
		
		if(data.controllingTeam == 'NEUTRAL'){
			
			wrapp.append($('<span>').addClass("level_0").addClass('portal_level').html("NEUTRAL"));
			return wrapp;
			
		}
		
		var energyTotal = $('<div>').addClass('energyTotal').addClass("bg_"+data.controllingTeam.toLowerCase()).
								css({'width':((data.energy/data.energyMax)*100)+'%'});
		energyMax.append(energyTotal);
		energyWrapp.append(energyMax);
		
		var energyTxt = $('<div>').addClass('energyTxt').html ("("+data.energy+"/"+data.energyMax+")");
		
		energyWrapp.append(energyTxt);
		
		var fact_icon = $('<div>').addClass('fact_icon').addClass(data.controllingTeam.toLowerCase());
		var ownerTxt = $('<div>').addClass('owner').html('Owner ');
		var portalOwner = $('<span>').addClass(data.controllingTeam.toLowerCase()).html(data.owner);
		ownerTxt.append(portalOwner);
		
		var infoTable = $('<table>').attr('cellspacing','0').attr('cellpadding',0).addClass('clear');
		
		var modsRow = $('<tr>').addClass('mods');
		
		
		for(i =0; i<data.mods.length;i++){
			var elm = $('<td>').addClass('mod');
			if(data.mods[i])
				elm.html('<span class="'+data.mods[i].rarity.toLowerCase()+'"><img src="img/'+data.mods[i].type+'_'+data.mods[i].rarity.replace("_", "")+'.png" width="40" alt="'+data.mods[i].name+'" title="'+data.mods[i].name+'"/><br />'+data.mods[i].rarity.toLowerCase().replace('_', ' ')+'</span>');
			else
				elm.html('<br />none');
			modsRow.append(elm);
		}
		infoTable.append(modsRow);
		
		infoTable.append('<tr><td colspan="4">Resonators</td></tr>');
		
		for(i =0; i<8;){
			
			for(j=0; j<2;j++){
				
				if(j==0){
					var row = $("<tr>").addClass('resonators').addClass(data.controllingTeam.toLowerCase());
				}
				var owner = $('<td>').addClass('owner');
				var res_energy = $('<td>').addClass('energy');
				var res_energy_max = $('<div>').addClass('energy_max');
				if(data.resonators[portalDistribution[i]]){
					var resonator = data.resonators[portalDistribution[i]];
					owner.html(resonator.owner);

					var res_energy_total = $('<div>').addClass('energy_total').addClass('subtitle').addClass('bg_level_'+resonator.level).css({'width':((resonator.energyTotal/resonator.energyMax) *100 )+"%"});//.html("L"+resonator.level+" "+((resonator.energyTotal/resonator.energyMax) *100 )+"%");
					var res_level = $('<span>').addClass('resonator_level').addClass('subtitle').html("L"+resonator.level);
					var res_percent = $('<span>').addClass('resonator_percent').addClass('subtitle').html(Math.round((resonator.energyTotal/resonator.energyMax) *100 )+"%");
					
					res_energy_max.append(res_energy_total,res_level,res_percent);
					res_energy.append(res_energy_max);
				}
				res_energy.append(res_energy_max);
				if(j==0){
					row.append(owner);
					row.append(res_energy);
				} else {
					row.append(res_energy);
					row.append(owner);
					infoTable.append(row);
				}
				i++;
			}
		}
		
		
		
		
		
		wrapp.append(level);
		wrapp.append(fact_icon);
		
		wrapp.append(energyWrapp);
		wrapp.append(ownerTxt);
		
		wrapp.append(infoTable);	
		
		return wrapp;
	}
	
function getPortalInfo(guid,timestamp, elm){
	if(xhr)
		xhr.abort();
	
	if(typeof cachePortalData[guid] == 'undefined'){
		xhr = $.ajax({
				url: 'portalInfo.php',
				type: 'POST',
				async: true,
				data:{
					ajax: true,
					guid: guid,
					timestamp: timestamp
				},
				success: function(data,status){
						
					try {
						
						data = $.parseJSON(data);
					} catch (e) {
						
						elm.html($('<div class="error">Invalid response!</div>'));
						return;
					}
					
					if(typeof data.error == 'undefined'){
						elm.html( generatePortalInfoContent(data));
						cachePortalData[guid] = data;
						return;
						
					} else {
						elm.html( $('<div class="error">'+data.error+'</div>'));
						return;
					}
					
					
				},
				error: function(jqXHR, textStatus, errorThrown)
					{
						console.log(jqXHR + textStatus  + errorThrown);
					}
			});
	} else {
		elm.html(generatePortalInfoContent(cachePortalData[guid]));
	}
	
	
	return;
}
	
var portalDistribution = {
	0: 2,
	1: 1,
	2: 3,
	3: 0,
	4: 4,
	5: 7,
	6: 5,
	7: 6
};
$(document).ready(function(){
	try {
		var $grid = Grid.init();
	} catch(e){
		
	}
	
	
	$('.sorter').click(function(e){
		$grid.closePreview();
		
		
		if(!$(this).hasClass('active')){
			$('.sorter.active').removeClass('active').children('span').html('');
			$(this).addClass('active');
		}
		var sort_way = $(this).data('sortway');
		var sort_by = $(this).data('sortby');
 	
		if(sort_way =='asc'){
			$(this).data('sortway','desc').children('span').html('\u2191');
			
			
		} else {
			$(this).data('sortway','asc').children('span').html('\u2193');;
			
		}
		
		
		$("#og-grid li").tsort('a', {'attr':'data-'+sort_by,'order':sort_way});
		
		$grid.updateItems();
		
		return false;
	});
	
	
				
			
});


